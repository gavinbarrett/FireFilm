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
		img = open('f.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_3(self):
		msg = 'this is a secret message'
		img = open('latexLogo.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_4(self):
		msg = 'trolleyollyoxenfree'
		img = open('mia.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_5(self):
		msg = 'supercalifragilisticexpialidocious'
		img = open('mia.jpg', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_6(self):
		msg = 'scoobityboobitydoobitydoop'
		img = open('tux.jpg', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_7(self):
		msg = 'slide to the left, slide to the right!'
		img = open('error.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_8(self):
		msg = 'woohoo look at me now!'
		img = open('excred.png', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_9(self):
		msg = 'ahahahahahahahahaha'
		img = open('sonic.jpg', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)
	
	def test_case_10(self):
		msg = 'My power is growing immensely'
		img = open('zen.jpg', 'rb')
		data = img.read()
		img.close()
		f = encode(data, msg)
		self.assertEqual(decode(f), msg)


if __name__ == "__main__":
	main()
