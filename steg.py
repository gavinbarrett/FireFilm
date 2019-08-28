import re
import hmac
import hashlib
import binascii
from PIL import Image

def pad_hex(b):
    if len(b) == 1:
        return '0' + b
    elif len(b) == 0:
        return '00'
    return b

def bth(binary):
    return pad_hex(hex(int(binary, 2))[2:])

def read_img():
    # load encoded file
    png = './encodedfile.png'
    
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
     
    # read in potential encoding
    n = newer[0:9]
    print(n)
    
    # if zero padding exists in the first nine bites, consider the text between as the hash
    if (n[0] == '00' and n[1] == '00' and n[len(n)-2] == '00' and n[len(n)-1] == '00'):
        digest = ''.join(n[2:7])
        print(digest)
    

        rest = ''.join(newer[9:len(newer)])
        #print(rest) 
        
        x = re.search(digest, rest)
        #print('x')
        #diff = x.end()-x.start()
        #print(x.end()-x.start())

        message = rest[0:x.start()-4]
        message = [message[i:i+2] for i in range(0, len(message), 2)]
        print("message")
        print(message)
        
        a = ''
        for m in message:
            a += chr(int(m, 16))
        print('message is ' + a)
    else:
        print('no hash found')

    


    # iterate through newer. array must consist of two bytes of zeroes followed by five bytes from a hash of the message and then two more zero bytes
    # we then must read the remaining bytes of the file until we find the ending buffer, which is the same buffer as above. If we don't find it, encoding is invalid. If we do find it, everything in between the two buffers contains the message. This can now be decoded byte by byte into ascii
    
    f = open('rest.txt', 'w')
    for n in rest:
        f.write(n + ' ')
    f.close()



def run():
    # get image
    jpg = './miawallace.jpg'

    # open the image with PIL
    img = Image.open(jpg, 'r')

    a = get_input()

    if(check_sizes(img.size, len(a)*8)):
        print('message can fit')
        newImg = img.copy()
        encode(newImg, a)
    else:
        print("message cannot fit")


def half_mac(plaintext):
    ''' return the first ten bytes of the messages hmac '''

    plain = bytes(plaintext, 'UTF-8')
    secret = b'secret'
    auth = hmac.new(secret, plain, hashlib.sha256)
    hash_head = auth.hexdigest()[0:10]
    c = ''
    for a in range(0, len(hash_head), 2):
        
        c += pad_bits(bin(int(hash_head[a:a+2], 16))[2:])
    print(c)
    return c

def trans_ascii(ascii):
    ''' turn an ascii character into its binary string representation '''
    return ''.join(list(map(lambda x: pad_bits(str(bin(ord(x))[2:])), ascii)))
    #a = ''
    #for c in ascii:
    #    a += pad_bits(str(bin(ord(c))[2:]))

def get_input():
    ''' retrieve the input message '''
    return input("What message would you like to hide?")

def check_sizes(imgsz, txtsz):
    ''' return true if message can be fit inside of image '''
    return True if txtsz < (imgsz[0] * imgsz[1] * 3) else False

def init_buffers(plaintext):
    ''' initialize buffers for encode/decode processes '''
    zs = '0000000000000000'
    return zs + half_mac(plaintext) + zs

def pad_bits(bits):
    ''' return the binary string padded with zeroes to a multiple of 8 '''
    if len(bits) % 8 != 0:
        return ((8 - (len(bits) % 8)) * '0') + bits
    return bits

def encode(img, b):
    ''' encode message into the image '''
    # get dynamic buffer to demarcate message
    buffers = init_buffers(b)
    #yss = [pad_bits(buffers[x:x+8]) for x in range(0, len(buffers), 8)]
    #print(yss)
    #print('buffers')
    #print(buffers)
    # read in image data
    data = list(img.getdata())
    
    # ready payload for delivery into image
    payload = buffers + trans_ascii(b) + buffers
    
    # join each byte together and interpret it as hexadecimal
    newer = [bth(pad_bits(''.join(list(payload[x:x+8])))) for x in range(0, len(payload), 8)]
    #TODO: remove below after testing
    f = open('tester.txt', 'w')
    for n in newer:
        f.write(n + ' ')
    f.close()
    
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
    img.save('encodedfile.png')
read_img()
#run()
