import cherrypy
import time
import json
import os
import logon


class Root():
	def __init__(self):
		self.logon=logon.Logon("/")

	@cherrypy.expose
	def i2cFetch(self):
		JSON=json.dumps({'V1':{'data':{'VOUT':24,
										'VIN':2
										}},
						'V2':{'data':{'VOUT':12,
								'VIN':1,
								
								},'mark':'bad'},
						'V3':{'data':{'VOUT':24,
								'VIN':2,
								'ERRROR_REGISTER':'10101010',
								
								},'mark':'good'},
						'V4':{'data':{'VOUT':2,
								'VIN':0.5
								}},})
		return JSON
	
	@cherrypy.expose
	def index(self):
		logon.Logon.checkauth("/logon")
		with open("preliminary.html",'r') as page:
			s=page.read();
		return s
		
		
#cherrypy.tree.mount(logon.Logon("/"),"/logon",{})
cherrypy.tree.mount(Root(),"/",{"/":{'tools.staticdir.on':True,
								'tools.staticdir.dir':os.getcwd(),
								}})
cherrypy.config.update({"tools.sessions.on":True})
cherrypy.engine.start()
cherrypy.engine.block()
