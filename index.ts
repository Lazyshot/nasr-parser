import * as nasr from './lib';

const data = nasr.parseFile("./data");

data.then((d) => {
    console.log(d.airports)
})