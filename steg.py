import hmac
import hashlib
from PIL import Image
from binascii import unhexlify
from random import randint

def run():
    # get image
    jpg = './miawallace.jpg'

    # open the image with PIL
    img = Image.open(jpg, 'r')

    a = get_input()
    print(a)
    if(check_sizes(img.size, len(a)*8)):
        print('message can fit')
        encode(img, a)
    else:
        print("message cannot fit")


def half_mac(plaintext):
    plain = bytes(plaintext, 'UTF-8')
    secret = b'secret'
    auth = hmac.new(secret, plain, hashlib.sha256)

    hash_head = auth.hexdigest()[0:10]
    c = ''
    for a in range(0, len(hash_head), 2):
        c += bin(int(hash_head[a:a+2], 16))[2:]
    return c

def trans_ascii(ascii):
    a = ''
    for c in ascii:
        a += str(bin(ord(c))[2:])
    print(a)
    return a

def get_input():
    ''' retrieve the input message '''
    return input("What message would you like to hide?")
    #return ''.join(list(map(lambda x: pad_bits(str(bin(ord(x)))[2:]), i)))

def check_sizes(imgsz, txtsz):
    ''' return true if message can be fit inside of image '''
    return True if txtsz < (imgsz[0] * imgsz[1] * 3) else False

def init_buffers(plaintext):
    ''' initialize buffers for encode/decode processes '''
    zs = '00000000'
    return zs + half_mac(plaintext) + zs

def pad_bits(bits):
    ''' return the binary string padded with zeroes to a multiple of 8 '''
    return ((8 - (len(bits) % 8)) * '0') + bits

def encode(img, b):

    # get dynamic buffer to demarcate message
    buffers = init_buffers(b)

    # read in image data
    data = list(img.getdata())

    # initialize final payload wrapped by buffers
    payload = buffers + trans_ascii(b) + buffers
    print(payload)
    newT = []
    for d in data:
        for t in d:
            if payload:
                p = int(payload[0])
                payload = payload[1:]
                if t % 2 == 0:
                    if p % 2 == 0:
                        newT.append(t)
                    elif p == 0:
                        newT.append(t)
                    else:
                        newT.append(t-1)
                else:
                    if p % 2 == 1:
                        newT.append(t)
                    else:
                        newT.append(t-1)
    print(newT)
run()
