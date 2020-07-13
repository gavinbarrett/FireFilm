import os
import re
import hmac
import hashlib
from io import BytesIO
from itertools import chain
from binascii import hexlify, unhexlify
from PIL import Image

def bin_to_hex(binary):
	''' turn a binary string into a padded hex string '''
	return format(int(binary, 2),'02x')

def hex_to_bin(hexa):
    ''' turn each byte of hex into binary '''
    binary_strings = [str(format(int(hexa[x:x+2], 16),'08b'))for x in range(0, len(hexa), 2)]
    return ''.join(binary_strings)

def ascii_to_binary(asc):
	''' turn an ascii character into its binary string representation '''
	# iterate through the characters and turn them into binary strings
	return ''.join(list(map(lambda x: str(format(ord(x),'08b')), asc)))

def zero_padded(n):
    ''' return true if string is correctly padded with zeros '''
    return (n[0] == '00' and n[1] == '00' and n[len(n)-2] == '00' and n[len(n)-1] == '00')

def init_buffers(plaintext):
	''' initialize buffers for encode/decode processes '''
	return '0000000000000000' + half_mac(plaintext) + '0000000000000000'

def half_mac(plaintext):
    ''' return the first ten bytes of the messages' hmac '''
    secret = os.urandom(20)
    # calculate the hash
    auth = hmac.new(secret, bytes(plaintext, 'UTF-8'), hashlib.sha256)
    # save the first ten chars of the hash
    hash_head = auth.hexdigest()[:10]
	# return the binary
    return ''.join(['{:08b}'.format(int(hash_head[i:i+1], 16)) for i in range(0,len(hash_head),2)])

def extract_lsb(data):
    ''' extract the least significant bits from each pixel '''
    # compress pixel tuples into a single list
    num_stream = list(chain(*data))
    # return the least significant bit of each value for each pixel
    return ''.join([str(num % 2) for num in num_stream])

def decode(png):
	img = Image.open(BytesIO(png))
	data = list(img.getdata())
	ls_bits = extract_lsb(data)
	hexa = [bin_to_hex(''.join(list(ls_bits[x:x+8]))) for x in range(0, len(ls_bits)-8, 8)]
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
		return ascii_message
	return None

def stegraph(data, payload):
	b = []
	for d in data:
		if payload:
			p = int(payload[0])		
			payload = payload[1:]
			if d % 2 == 0:
				if p % 2 == 0:
					b.append(d)
					#bytestring.write(bytes([d]))
				else:
					b.append(d+1) if not d else b.append(d-1)
					#bytestring.write(bytes([d+1])) if not d else bytestring.write(bytes([d-1]))
			else:
				b.append(d) if p % 2 else b.append(d-1)
				#bytestring.write(bytes([d])) if p % 2 else bytestring.write(bytes([d-1]))
		#else:
		#	b.append(d)
			#bytestring.write(bytes([d]))
	#bytestring.seek(0)
	#print(f'data {hexlify(bytestring.read())}')
	return bytes(b)

def write_to_file(data, payload):
    ''' overwrite the image data with the payload bits '''
    newT = []
    for d in data:
        for t in d:
            if payload:
                p = int(payload[0])
                payload = payload[1:]
                # if image data is even
                if t % 2 == 0:
                    if p % 2 == 0:
                        # payload data is also even
                        newT.append(t)
                    else:
                        newT.append(t+1) if not t else newT.append(t-1)
                # else if image data is odd
                else:
                    newT.append(t) if p % 2 else newT.append(t-1)
    return newT

def pixelize(pix_data, size=3):
	''' returns pixel tuples '''
	return [tuple(pix_data[i:i+size]) for i in range(0, len(pix_data), size)]

def encode(data, msg):
	''' encode message into the image '''
	# get dynamic buffer to demarcate message
	buffers = init_buffers(msg)
	# convert the message to a binary string
	binary = ascii_to_binary(msg)
	# ready payload for delivery into image
	payload = buffers + binary + buffers
	# load the binary bata as a PIL Image
	img = Image.open(BytesIO(data), 'r')
	#print(img.mode)
	if (img.mode != 'RGBA' or img.mode != 'RGB'):
		#print('converting')
		img = img.convert(mode='RGBA')
	# convert format to PNG
	if (img.format != 'PNG'):
		#print('Changing format')
		o = BytesIO()
		img.save(o, 'PNG')
		img = Image.open(o, 'r')
	# extract RGBA pixel data of the image
	pixels = list(img.getdata())
	#new_img = stegraph(pixels, payload)
	new_img = write_to_file(pixels, payload)

	newer = [bin_to_hex(''.join(list(payload[x:x+8]))) for x in range(0, len(payload), 8)]
	new_pix = pixelize(new_img, 4) if img.mode == 'RGBA' else pixelize(new_img)
	img.putdata(new_pix)

	out = BytesIO()
	img.save(out, format="PNG")
	return out.getvalue()
