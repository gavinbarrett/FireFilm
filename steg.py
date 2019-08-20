from PIL import Image

def run():
    # get image
    jpg = './miawallace.jpg'

    # open the image with PIL
    img = Image.open(jpg, 'r')

    a = get_input()
    print(a)
    if(check_sizes(img.size, len(a))):
        print('message can fit')
        encode(img, a)
    else:
        print("message cannot fit")

    #encode()

def get_input():
    ''' retrieve the input message '''
    i = input("What message would you like to hide?")
    return ''.join(list(map(lambda x: pad_bits(str(bin(ord(x)))[2:]), i)))

def check_sizes(imgsz, txtsz):
    ''' return true if message can be fit inside of image '''
    return True if txtsz < (imgsz[0] * imgsz[1] * 3) else False

def init_buffers():
    ''' initialize buffers for encode/decode processes '''

def pad_bits(bits):
    ''' return the binary string padded with zeroes to a multiple of 8 '''
    return ((8 - (len(bits) % 8)) * '0') + bits

def encode(img, b):

    data = list(img.getdata())

    for d in data:
        print(d)
        for t in d:
            print(t)

run()
