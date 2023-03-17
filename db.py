import sqlite3
import threading
import base64


class DB:
	threadlocal=threading.local()

	def __init__(self,tableName,*args):
		self.threadlocal.connection=sqlite3.connect("my.db")
		self.tableName=tableName
		cursor=self.threadlocal.connection.cursor()
		self.columns=[]
		for arg in args:
			self.columns.append(arg.split()[0])
		columns=",".join(key for key in args)
		sql=f"CREATE TABLE IF NOT EXISTS {tableName}({columns})"
		print(sql)
		cursor.execute(sql)
	
	def insert(self,*args):
		cursor=self.threadlocal.connection.cursor()
		columns=",".join(column for column in self.columns)
		sql=f"INSERT OR REPLACE INTO {self.tableName}({columns}) VALUES ("+",".join(["?" for arg in args])+")"
		
		# print(sql)
		
		cursor.execute(sql,args)
		self.threadlocal.connection.commit()
		
	def get(self,name="",column=None):
		cursor=self.threadlocal.connection.cursor()
		if not column: column="*"
		sql=f"SELECT {column} FROM {self.tableName}"
		if name: sql+=f" WHERE {self.columns[0]} = \"{name}\""
		
		print(sql)
		
		cursor.execute(sql)
		b=cursor.fetchall()
		# print(b)
		return b
		
	def delete(self,name):
		cursor=self.threadlocal.connection.cursor()
		sql=f"DELETE FROM {self.tableName} WHERE {self.columns[0]} = (?)"
		print(sql)
		cursor.execute(sql,(name,))
		self.threadlocal.connection.commit()
		
	def update(self,board,column,new):
		cursor=self.threadlocal.connection.cursor()
		sql=f"UPDATE {self.tableName} SET {column} = (?) WHERE {self.columns[0]} = (?)"
		print(sql)
		cursor.execute(sql,(new,board))
		self.threadlocal.connection.commit()
		
if __name__=="__main__":
	
	with open("photo.JPG","rb") as pic:
		blob1=pic.read()
	
	with open("screen.png","rb") as pic:
		blob2=pic.read()
	
	with open("shit1.JPG","rb") as pic:
		blob3=pic.read()
		
	with open("shit2.JPG","rb") as pic:
		blob4=pic.read()
	
	# mydb=DB()
	# mydb.get("myboard","frontSide")
	# dict={"a":36,"b":434}
	mydb=DB("people","name UNIQUE","age")
	
	
	
	# mydb=DB("boards","name UNIQUE","frontSide","rearSide")
	# mydb.insert("myboard",blob1,blob2)
	# mydb.insert("hisboard",blob3,blob4)
	
	
	# mydb.get("hisboard","frontSide")
	# print(mydb.get("theirboard","frontSide"))
	
	
	
	mydb.insert("ann",None)
	mydb.insert("me","26")
	mydb.insert("you",None)
	#print(mydb.get("ann"))
	# print(mydb.get("myboard","frontSide"))
	#mydb.update("ann","age","566")
	print(mydb.get("sss")==True)
	# mydb.delete("ann")
		
		
		
		
# def createTable(*args):
		
	# arguments=",".join(key for key in args)
	# print(arguments)
	
# createTable("k","dsfsdfds")

