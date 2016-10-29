#!/usr/bin/python

import sys
import time
import boto3
from . import passwords

def download(startingTimestamp, path):
	s3 = boto3.resource("s3",
		aws_access_key_id=Passwords.aws_access_key_id, 
		aws_secret_access_key=Passwords.aws_secret_access_key
		)
	bucket=s3.Bucket('efficientparameteroptimisation')
	keys = bucket.objects.filter(Prefix='userLogs/')

	smallestAcceptedKey="userLogs/"+startingTimestamp+".csv"

	print "Starting to download"
	for key in keys:
		if key.key > smallestAcceptedKey:
			fileName = key.key.split("/")[1]
			bucket.download_file(key.key, path+"/"+fileName)
			
if len(sys.argv)!=3:
	print "It requires 2 arguments: a starting UNIX timestamp and a folder path\
		destination where to donwnload the files"
	exit()

download(sys.argv[1], sys.argv[2])