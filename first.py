from django import http
from django.http import HttpResponse
from django.template import loader
from django.template import Context
from django.template.loader import get_template
from django.http import JsonResponse
from threading import Thread
import time
from ipware.ip import get_ip
import boto3
import urllib2, json
from . import highScores
from . import passwords


class Vars(object):
	lastFlushTimestamp = int(time.time())
	logs = ""

	page_id_start_game=1
	page_id_new_move=2
	page_id_finish_game=3

def index(request):
	request.session['has_session'] = True
	request.session.set_expiry(60*60) #60 minutes

	request.session['targetNumber'] = 3		
	request.session['steps'] = 0

	appendToLogs(None, request, \
		request.session['targetNumber'], Vars.page_id_start_game, None);

	return http.HttpResponse( get_template('index.html').render() )

def uploadToS3():
	s3 = boto3.resource("s3",
		aws_access_key_id=Passwords.aws_access_key_id, 
		aws_secret_access_key=Passwords.aws_secret_access_key
		)
	s3.Bucket('efficientparameteroptimisation').put_object(
		Key="userLogs/"+str(int(time.time()))+".csv", Body=Vars.logs)

	Vars.lastFlushTimestamp=int(time.time())
	Vars.logs=""

def getKnobs(request):
	return [request.GET.get('k1', ''),
			request.GET.get('k2', ''),
			request.GET.get('k3', ''),
			request.GET.get('k4', ''),
			request.GET.get('k5', '')]

def appendToLogs(knobs, request, targetNumber, pageId, currentScore):
	session_key=request.session.session_key
	session_key	= '' if session_key is None else session_key

	knobsStr='null'
	if knobs is not None:
		knobsStr=knobs[0]+";"+knobs[1]+";"+knobs[2]+";"+knobs[3]+";"+knobs[4]
		
	currentScoreStr='null' if currentScore is None else str(currentScore)

	Vars.logs+=	str(int(time.time()))+","+ \
				get_ip(request) +","+ \
				session_key+"," + \
				knobsStr+"," + \
				str(targetNumber)+","+str(pageId)+","+currentScoreStr+"\n"

	# Even though uploadToS3 may take more time than serving this HTTP request
	# 		the request will be served immidiately 
	# 		the uploadToS3 will continue to run in the background
	# lastFlushTimestamp= unix timestamp in seconds
	if (int(time.time()) - Vars.lastFlushTimestamp > 60*5) or \
		len(Vars.logs) > 500*65 :
		thread = Thread(target = uploadToS3)
		thread.setDaemon(True)
		thread.start()


def getCost(knobs, targetNumber):
	url = "http://s3-eu-west-1.amazonaws.com/efficientparameteroptimisation/json_data/"+ \
			knobs[0]+"_"+knobs[1]+"_"+knobs[2]+"_"+knobs[3]+"_"+knobs[4]+".json"
	response = urllib2.urlopen(url)
	data = json.loads(response.read().decode("utf-8"))

	# targets are from 1 to 44 (inclusive at both ends)
	return (data['cost'])[int(targetNumber)-1]
				 		
def update(request):
	knobs=getKnobs(request)

	steps=request.session['steps'] if 'steps' in request.session else 0
	request.session['steps']= steps + 1

	targetNumber=request.session['targetNumber']	
	currentScore=getCost(knobs, targetNumber)

	if ('bestScore' not in request.session) or \
		(request.session['bestScore'] > currentScore):
		# we have a highscore
		request.session['bestScore']= currentScore
		request.session["bestCombination"]= knobs

	appendToLogs(knobs, request, targetNumber, Vars.page_id_new_move, currentScore)

	request.session.set_expiry(60*60) #60 minutes

	response_data = {}
	response_data['targetNumber'] = request.session['targetNumber']	
	response_data['bestScore'] = request.session['bestScore']
	return JsonResponse(response_data)

def getCurrentScore(request):
	response_data = {}
	response_data['targetNumber'] = request.session['targetNumber']	
	response_data['bestScore']= 100 if 'bestScore' not in request.session \
									else request.session['bestScore']
	return JsonResponse(response_data)

def changeLevel(request):
	targetNumber=request.GET.get('targetNumber', '')
	request.session['targetNumber']= targetNumber
	request.session['steps'] = 0
	clearBestScore(request)

	appendToLogs(None, request, targetNumber, Vars.page_id_start_game, None)

	return HttpResponse(request.session['targetNumber'])

def clearBestScore(request):
	request.session['bestScore']=100
	request.session['bestCombination']= ['7','7','7','7','7']

def getCurrentTarget(request):
	if 'targetNumber' in request.session:	
		return request.session['targetNumber']
	return None

def getSteps(request):
	if 'steps' in request.session:	
		return request.session['steps']
	return None

def getBestScore(request):
	if 'bestScore' in request.session:
		return request.session['bestScore']
	else:
		return None

def isHighScore(request):
	currentTarget = getCurrentTarget(request)
	bestScore = getBestScore(request)
	if (currentTarget is not None) and (bestScore is not None):
		if bestScore < highScores.getLastHighScore(currentTarget):
			return True
	return False

def finishGame(request):
	appendToLogs(None, request, getCurrentTarget(request), Vars.page_id_finish_game, None)
	return HttpResponse( 1 if isHighScore(request) else 0 )

def submitNickname(request):
	if not isHighScore(request):
		return

	target=getCurrentTarget(request)
	score=getBestScore(request)
	nickname=request.GET.get('nickname', '')
	steps=getSteps(request)

	highScores.addHighScore(target, score, nickname, steps)

	# we delete the achievement from the current session
	clearBestScore(request)
	request.session['steps'] = 0

	return HttpResponse()

def getHghScores(request):
	target=getCurrentTarget(request)
	return HttpResponse( highScores.getHighScoresJson(target) )

def jumpToBestCombinationFoundSoFar(request):
	targetNumber=request.session['targetNumber']
	knobs=request.session["bestCombination"]
	return HttpResponse(",".join(knobs))
