from sys import path
path.append('..')
from src.steg import encode, decode
from unittest import TestCase, main

class TestSteg(TestCase):

	def test_case_1(self):
		msg = 'hello'
		img = open('32fav.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_2(self):
		msg = 'Attack at dawn'
		img = open('32fav.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_3(self):
		msg = 'this is a secret message'
		img = open('32fav.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_4(self):
		msg = 'trolleyollyoxenfree'
		img = open('32fav.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_5(self):
		msg = 'supercalifragilisticexpialidocious'
		img = open('32fav.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)


if __name__ == "__main__":
	main()
