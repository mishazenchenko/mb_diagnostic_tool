import cherrypy
import os.path
import sqlite3
import threading

class Logon:
	def __init__(self,homepage):
		self.homepage=homepage
		with open("index.html","r") as logonPageStream:
			self.logonPage=logonPageStream.read()
		
		
		# self.db="pwd.db"
		# conn=sqlite3.connect(self.db)
		# c=conn.cursor()
		# c.execute("CREATE TABLE IF NOT EXISTS pwdb(username unique not null,password not null)")
		# self.thread=threading.local()
		# c.execute("INSERT OR IGNORE INTO pwdb VALUES(?,?)",("username","password"))
		# c.execute("INSERT OR IGNORE INTO pwdb VALUES(?,?)",("huy","cvetochnuy"))
		# conn.commit()
		# conn.close()
		# self.thread=threading.local()
		# self.username=username
		# self.password=password
		# self.basepagePath=os.path.dirname(os.path.abspath(__file__))
	
	@staticmethod
	def checkpass(username,password):
		if username=="user" and password=="password": return True
		return False
		# auth=cherrypy.session.get("authenticated",None)
		# if(auth==None): raise cherrypy.HTTPRedirect("/logon")
		# raise cherrypy.HTTPRedirect("/index")
    
	@cherrypy.expose
	def index(self,username=None,password=None):
		errmessage=""
		
		if username and password:
			if self.checkpass(username,password):
				cherrypy.session["authenticated"]=username
				raise cherrypy.HTTPRedirect(self.homepage)
			else:
				errmessage="Wrong username and/or password!!!"
		
		return self.logonPage%{"errmessage":errmessage}
	
	
	@staticmethod
	def checkauth(logonpage):
		print(cherrypy.request.path_info)
		if cherrypy.session.get('authenticated',None):
			return
		else:
			raise cherrypy.HTTPRedirect(logonpage)
	
	
	
	# @cherrypy.expose
	# def logoff(self):
		
	
	
	
	
	
	
	
	
	
	
	
	
	
		# errmessage=""
		# if(username!="" or password!=""):
			# if not self.checkpass(username,password): 
				# print("a vot huy")
				# errmessage="Invalid username either/and password!"
			# else: 
				# raise cherrypy.HTTPRedirect("/index")
			# # cherrypy.session["authenticated"]=self.username
		# # if(username!="" or password!=""): self.checkauth()
		# with open(f"{self.basepagePath}/index.html","r") as basepageFile:
			# file=basepageFile.read()
		# return file%{"errmessage":errmessage}
	
	# def checkpass(self,username,password):
		# self.thread.conn=sqlite3.connect(self.db)
		# c=self.thread.conn.cursor()
		# c.execute("SELECT count (*) FROM pwdb WHERE username=? and password=?",(username,password))
		# if (c.fetchone()[0]==1):return True
		# #if(self.username==username and self.password==password): return True
		# return False
		
	# @cherrypy.expose
	# def index(self):
		# #checkauth()
		# return "index page"
		
if __name__=="__main__":
    # logon=Logon("user","password")
    cherrypy.quickstart(Logon(),config={"/":{"tools.sessions.on":True}})
	#print(logon.checkpass())
	#logon.logon("user","password")