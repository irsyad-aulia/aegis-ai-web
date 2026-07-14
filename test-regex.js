const regex = /SELECT\s+.*FROM\s+.*\s+WHERE\s+.*=\s*\${.*}/i;
const line = '    const query = `SELECT * FROM users WHERE id = ${id}`;';
console.time('regex');
console.log(regex.test(line));
console.timeEnd('regex');
