import os
import re
import hmac
import hashlib
from io import BytesIO
from itertools import chain
from PIL import Image

def bin_to_hex(binary):
    ''' turn a binary string into a padded hex string '''
    return format(int(binary, 2),'02x')

def hex_to_bin(hexa):
    ''' turn each byte of hex into binary '''
    binary_strings = [str(format(int(hexa[x:x+2], 16),'08b'))for x in range(0, len(hexa), 2)]
    return ''.join(binary_strings)

def trans_ascii(asc):
    ''' turn an ascii character into its binary string representation '''
    # iterate through the characters and turn them into binary strings
    return ''.join(list(map(lambda x: str(format(ord(x),'08b')), asc)))

def zero_padded(n):
    ''' return true if string is correctly padded with zeros '''
    return (n[0] == '00' and n[1] == '00' and n[len(n)-2] == '00' and n[len(n)-1] == '00')

def get_input():
    ''' retrieve the input message '''
    return input("What message would you like to hide? ")

def check_sizes(imgsz, txtsz):
    ''' return true if message can be fit inside of image '''
    # check if message plus 140 bits of padding can fit
    return (txtsz + 140) < (imgsz[0] * imgsz[1] * 3)

def init_buffers(plaintext):
    ''' initialize buffers for encode/decode processes '''
    zeros = '0000000000000000'
    return zeros + half_mac(plaintext) + zeros

def half_mac(plaintext):
    ''' return the first ten bytes of the messages' hmac '''
    # decode the plaintext as UTF-8
    plain = bytes(plaintext, 'UTF-8')
    # generate a random secret to throw into HMAC
    # this hash functionality is essentially used for matching purposes only;
    # as such, we shouldn't need to worry too much about the size of the key
    secret = os.urandom(20)
    # calculate the hash
    auth = hmac.new(secret, plain, hashlib.sha256)
    # save the first ten chars of the hash
    hash_head = auth.hexdigest()[:10]
    # return the binary
    return hex_to_bin(hash_head)

def extract_lsb(data):
    ''' extract the least significant bits from each pixel '''
    # compress pixel tuples into a single list
    num_stream = list(chain(*data))
    # return the least significant bit of each value for each pixel
    return ''.join([str(num % 2) for num in num_stream])

def decode(png):
    ''' load encoded file '''
    # open image file handle in read mode
    img = Image.open(png, 'r')

    # grab data
    data = list(img.getdata())

    # extract least significant bits
    ls_bits = extract_lsb(data)
    
    # interpret binary data as hexadecimal
    hexa = [bin_to_hex(''.join(list(ls_bits[x:x+8]))) for x in range(0, len(ls_bits)-8, 8)]
    
    # read in potential encoding
    encoding = hexa[:9]
    
    # if zero padding exists in the first nine bytes, consider the text between as the hash digest
    if zero_padded(encoding):
        # grab potential message digest
        digest = ''.join(encoding[2:7])
        # save the rest of the file info
        rest = ''.join(hexa[9:len(hexa)])
        # search the remainder of the file for the end buffer
        x = re.search(digest, rest)
        # save the string between the start and end buffers
        hex_message = rest[0:x.start()-4]
        # reinterpret string as hex strings
        hex_message = [hex_message[i:i+2] for i in range(0, len(hex_message), 2)]
        # reinterpret hex strings as ascii characters
        ascii_message = ''.join(list(map(lambda x: chr(int(x, 16)), hex_message)))
        print('The file reads: "' + ascii_message + '".')
    else:
        print('No message found.')

def stegraph(data, payload):
	bytestring = BytesIO()
	for d in data:
		if payload:
			p = int(payload[0])		
			payload = payload[1:]
			if d % 2 == 0:
				if p % 2 == 0:
					bytestring.write(bytes([d]))
				else:
					bytestring.write(bytes([d+1])) if not d else bytestring.write(bytes([d-1]))
			else:
				bytestring.write(bytes([d])) if p % 2 else bytestring.write(bytes([d-1]))
		else:
			bytestring.write(bytes([d]))
	bytestring.seek(0)
	return bytestring.read()

def encode(data, msg):
	''' encode message into the image '''
	# get dynamic buffer to demarcate message
	buffers = init_buffers(msg)
	# ready payload for delivery into image
	payload = buffers + trans_ascii(msg) + buffers
	# load the binary bata as a PIL Image
	img = Image.open(BytesIO(data), 'r')
	# extract RGBA pixel data of the image
	pixels = list(img.getdata())
	# transform pixel data into a 1-D array
	pix_d = list(chain(*pixels))
	# encode the image with msg
	new_img = stegraph(pix_d, payload)
	# save the encoded pixel data into an Image object
	im = Image.frombytes('RGBA', img.size, new_img)
	# save image 
	out = BytesIO()
	im.save(out, format="PNG")
	# return the binary of the encoded image
	return out.getvalue()
