from django.db import models
from django.core import serializers
import sys

maxTopSize = 5

class HighScore(models.Model):
	target = models.IntegerField()
	score = models.DecimalField(max_digits=20, decimal_places=4)
	nickname = models.CharField(max_length=30)
	steps = models.IntegerField()

def getHighScoresJson(nTarget):
	return serializers.serialize("json", HighScore.objects.filter(target=nTarget).order_by('score'))

def addHighScore(nTarget, nScore, nNickname, nSteps):
	newHighScore = HighScore(target=nTarget, score=float(nScore), nickname=nNickname,
		steps=nSteps)
	newHighScore.save()

	currentTop = HighScore.objects.filter(target=nTarget)
	if len(currentTop) > maxTopSize:
		lastOne = currentTop.order_by('score').last().delete()
	return

def getLastHighScore(nTarget):
	try:
		currentTop = HighScore.objects.filter(target=nTarget)
		# if all the top positions have been filled we return the worst score
		if len(currentTop)>=maxTopSize:
			lastOne = currentTop.order_by('score').last()
			return lastOne.score
		# else return max number
		return sys.maxint
	except HighScore.DoesNotExist:
		return sys.maxint
