import pkg from './package.json';

export default [
  {
    external: ['knex', 'objection', 'mysql'],
    input: 'src/main.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
  }
];
