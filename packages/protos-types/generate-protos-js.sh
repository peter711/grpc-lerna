#!/bin/bash

PROTO_DIR=./dist

echo "Generating protos types"

# Generate JavaScript code
npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:${PROTO_DIR} \
    --grpc_out=grpc_js:${PROTO_DIR} \
    --plugin=protoc-gen-grpc=../../node_modules/.bin/grpc_tools_node_protoc_plugin \
    -I ../protos \
    ../protos/*.proto

# Generate TypeScript code (d.ts)
npx grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=../../node_modules/.bin/protoc-gen-ts \
    --ts_out=grpc_js:${PROTO_DIR} \
    -I ../protos \
    ../protos/*.proto

echo "Finished generating protos types"
