import os
import re
import hmac
import hashlib
import binascii
from PIL import Image

def pad_hex(b):
    ''' pad a single hex character with a zero '''
    if len(b) == 1:
        return '0' + b
    return b

def bth(binary):
    ''' turn a binary string into a padded hex string '''
    return pad_hex(hex(int(binary, 2))[2:])

def trans_ascii(asc):
    ''' turn an ascii character into its binary string representation '''
    # iterate through the characters and turn them into binary strings
    return ''.join(list(map(lambda x: pad_bits(str(bin(ord(x))[2:])), asc)))

def get_input():
    ''' retrieve the input message '''
    return input("What message would you like to hide? ")

def check_sizes(imgsz, txtsz):
    ''' return true if message can be fit inside of image '''
    #TODO: fix this function; size is not correct
    return txtsz < (imgsz[0] * imgsz[1] * 3)

def init_buffers(plaintext):
    ''' initialize buffers for encode/decode processes '''
    zs = '0000000000000000'
    return zs + half_mac(plaintext) + zs

def pad_bits(bits):
    ''' return the binary string padded with zeroes to a multiple of 8 '''
    if len(bits) % 8 != 0:
        return ((8 - (len(bits) % 8)) * '0') + bits
    return bits

def half_mac(plaintext):
    ''' return the first ten bytes of the messages hmac '''
    plain = bytes(plaintext, 'UTF-8')
    
    secret = os.urandom(16)
    
    # calculate the hash
    auth = hmac.new(secret, plain, hashlib.sha256)
    # save the first ten chars of the hash
    hash_head = auth.hexdigest()[:10]
    c = ''
    for char in range(0, len(hash_head), 2):
        # concatenate first ten characters as bits
        c += pad_bits(bin(int(hash_head[char:char+2], 16))[2:])
    return c

def decode(png):
    ''' load encoded file '''
    # open image file handle in read mode
    img = Image.open(png, 'r')

    # grab data
    data = list(img.getdata())
    bs = []
    for d in data:
        bstr = ''
        for t in d:
            bstr += str(t % 2)
            bs.append(bstr)
            bstr = ''
    bs = ''.join(bs)
    newer = [bth(''.join(list(bs[x:x+8]))) for x in range(0, len(bs)-8, 8)]
    #print(newer)
    # read in potential encoding
    n = newer[0:9]
    
    # if zero padding exists in the first nine bytes, consider the text between as the hash digest
    if (n[0] == '00' and n[1] == '00' and n[len(n)-2] == '00' and n[len(n)-1] == '00'):
        # grab potential message digest
        digest = ''.join(n[2:7])
        #print('Digest: ' + digest)
    
        # save the rest of the file info
        rest = ''.join(newer[9:len(newer)])
        
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

def encode(img, b):
    ''' encode message into the image '''
    # get dynamic buffer to demarcate message
    buffers = init_buffers(b)
    
    # read in image data
    data = list(img.getdata())
    
    # ready payload for delivery into image
    payload = buffers + trans_ascii(b) + buffers
    
    # join each byte together and interpret it as hexadecimal
    newer = [bth(pad_bits(''.join(list(payload[x:x+8])))) for x in range(0, len(payload), 8)]
    
    
    #FIXME: refactor nested loops to a seperate function
    newT = []
    for d in data:
        for t in d:
            if payload:
                p = int(payload[0])
                payload = payload[1:]
                # image data is even
                if t % 2 == 0:
                    # image data is even
                    if p % 2 == 0:
                        # payload data is also even
                        newT.append(t)
                        # payload data is odd
                    else:
                        if t == 0:
                            newT.append(t+1)

                        else:
                            newT.append(t-1)

                # image data is odd
                else:
                    if p % 2 == 1:
                        newT.append(t)

                    else:
                        newT.append(t-1)


    # split new pixel values into 3-tuples
    newPixels = [tuple(newT[i:i+3]) for i in range(0, len(newT) - 2, 3)]
    
    # insert data into beginning of the file
    img.putdata(newPixels)
    
    # save image as png; saving as jpg will compress and corrupt data
    img.save('./encodedfile.png')

def init_encoding(jpg):
    # open the image with PIL
    img = Image.open(jpg, 'r')

    a = get_input()

    if(check_sizes(img.size, len(a)*8)):
        print('message can fit')
        newImg = img.copy()
        encode(newImg, a)
    else:
        print("message cannot fit")
