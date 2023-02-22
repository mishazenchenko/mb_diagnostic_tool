import cherrypy
import os.path
import time
import json
	
class Root():
	@cherrypy.expose
	def index(self,*args,**kwargs):
		for i,e in kwargs.items():
			print(f"{i}:{e}")
		#print(serial,inventary,mac_address)
		with open("firmware.html",'r') as page:
			s=page.read();
		return s
	
	@cherrypy.expose
	def fetchResponse(self):
		JSON=json.dumps({'a':'asdads','b':'sssssss','time':time.asctime()})
		return JSON#time.asctime()
		
cherrypy.quickstart(Root(),config={})