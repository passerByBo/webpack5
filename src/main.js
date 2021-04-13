let output = '';

async function main() {
    const dynamic = import('./data');
    output = dynamic + 'hello';
}

main();

export  {output};