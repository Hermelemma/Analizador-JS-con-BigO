#!/bin/bash
jison grammar.jison
sed -i "s+var grammar+import Node from './clases/Node';\nimport { get_complex } from './clases/Reports';\nexport var grammar+g" grammar.js