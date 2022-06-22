

# def get_mod(dura, size, iura):
#     return (iura % size)+float(format(dura-iura, '.2f'))


def get_time(dura: float, size: int):
    if size > dura or size > 60:
        return [[0, dura]]
    iura = int(dura)
    times = iura//size
    if times > 10:
        return [[0, dura]]
    if times < 2:
        return [[0, size], [size, dura]]
    ret = []
    prev = 0
    count = 0
    while count < times:
        ret.append([prev, prev+size])
        prev += size
        count += 1
    ret.append([prev, dura])
    return ret
