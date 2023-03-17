import db
import cherrypy
import json
import base64
import codecs
import os
from string import Template


@cherrypy.popargs("board")
class Root:
	def __init__(self):
		self.images=Images()
		self.data=Data()
		self.set=Set()
		#self.static=Static()
	
	with open("boardCRUD.html",'r') as page:
		page=page.read();
		

		
	@cherrypy.expose
	def index(self,board=None):
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		boards=dataBase.get("","name")
		inserted=""
		for board in boards:
			inserted+=f"<div>{board[0]}</div>"
			print(inserted)
		
		data={"insertion":inserted}
		return Template(self.page).substitute(data)
		
		
	
	@cherrypy.expose	
	def delete(self,board=None):
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		dataBase.delete(board)
		
	
	
# class Static:
	# @cherrypy.expose
	# def index(self):
		# print("static")
	
#@cherrypy.popargs("board","side")	
class Set:
	with open("boardCheckpoints.html",'r') as page2:
		page2=page2.read();
	
	@cherrypy.expose
	def index(self):
		self.board=cherrypy.request.cookie["board"].value
		self.side=cherrypy.request.cookie["side"].value
		return self.page2

	@cherrypy.expose
	def info(self):
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		print(self.board," ",self.side)
		data=dataBase.get(self.board).pop()
		image=None
		if self.side=="sideA": 
			image=data[1]
		elif self.side=="sideB": 
			image=data[2]
		return json.dumps({"image":"data:;base64,"+base64.b64encode(image).decode(),
						"board":self.board,
						"side":self.side})


@cherrypy.expose
@cherrypy.popargs("board","side")
class Images:
	def GET(self,board,side):
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		sides=dataBase.get(board).pop()
		if side=="sideA": 
			return sides[1]
		elif side=="sideB": 
			return sides[2]
	
	def POST(self,board,side):
		emptyJSON=json.dumps("")
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		#print(cherrypy.request.body.read())
		if not dataBase.get(board):
			if side=="sideA": dataBase.insert(board,cherrypy.request.body.read(),emptyJSON,emptyJSON)
			elif side=="sideB": dataBase.insert(board,None,cherrypy.request.body.read(),emptyJSON,emptyJSON)
		else:
			if side=="sideA": dataBase.update(board,"frontSide",cherrypy.request.body.read())
			elif side=="sideB": dataBase.update(board,"rearSide",cherrypy.request.body.read())
		
		
@cherrypy.expose
@cherrypy.popargs("board","side")
class Data:
	def GET(self,board,side):
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		data=dataBase.get(board).pop()
		if side=="sideA":return data[3]
		if side=="sideB":return data[4]
		
	def POST(self,board,side):
		dataBase=db.DB("boards","name UNIQUE","frontSide","rearSide","data1","data2")
		if side=="sideA": dataBase.update(board,"data1",cherrypy.request.body.read())
		if side=="sideB": dataBase.update(board,"data2",cherrypy.request.body.read())
		
		
if __name__=="__main__":

	conf={"/images":{"request.dispatch": cherrypy.dispatch.MethodDispatcher()},
		  "/data":{"request.dispatch": cherrypy.dispatch.MethodDispatcher()},

		  "/set":{"tools.staticdir.on":True,
				  "tools.staticdir.dir":os.getcwd()},
		  "/":{"tools.sessions.on":True}
		  }
		  
	
	cherrypy.quickstart(Root(),'/admin',conf)
	# "request.dispatch": cherrypy.dispatch.Dispatcher(),
	# cherrypy.config.update({"tools.staticdir.on":True,
							# "tools.staticdir.dir":os.getcwd()})