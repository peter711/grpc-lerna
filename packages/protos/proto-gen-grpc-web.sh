#!/bin/bash

BIN_DIR=../../node_modules/.bin
PROTO_DIR=./generated
SERVER_PROTO_DIR=../grpc-server/src/protos
CLIENT_PROTO_DIR=../grpc-client/src/protos
REACT_PROTO_CLIENT_DIR=../react-client/src/protos

rm -f -R ${PROTO_DIR}
mkdir -p ${PROTO_DIR}

protoc -I=. *.proto \
  --plugin=protoc-gen-grpc-web=${BIN_DIR}/protoc-gen-grpc-web \
  --js_out=import_style=commonjs:${PROTO_DIR} \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:${PROTO_DIR}

protoc -I=. *.proto \
  --plugin=protoc-gen-grpc=${BIN_DIR}/grpc_tools_node_protoc_plugin \
  --js_out=import_style=commonjs:${PROTO_DIR} \
  --grpc_out=import_style=typescript,mode=grpcwebtext:${PROTO_DIR}

# # Generate JavaScript code
# npx grpc_tools_node_protoc \
#   --js_out=import_style=commonjs,binary:${PROTO_DIR} \
#   --grpc_out=grpc_js:${PROTO_DIR} \
#   --plugin=protoc-gen-grpc=../../node_modules/.bin/grpc_tools_node_protoc_plugin \
#   -I . \
#   *.proto

# # Generate TypeScript code (d.ts)
# npx grpc_tools_node_protoc \
#   --plugin=protoc-gen-ts=../../node_modules/.bin/protoc-gen-ts \
#   --ts_out=grpc_js:${PROTO_DIR} \
#   -I . \
#   *.proto

# Copying
rm -f -R ${SERVER_PROTO_DIR}
mkdir -p ${SERVER_PROTO_DIR}
cp -R ${PROTO_DIR}/* ${SERVER_PROTO_DIR}

rm -f -R ${CLIENT_PROTO_DIR}
mkdir -p ${CLIENT_PROTO_DIR}
cp -R ${PROTO_DIR}/* ${CLIENT_PROTO_DIR}

rm -f -R ${REACT_PROTO_CLIENT_DIR}
mkdir -p ${REACT_PROTO_CLIENT_DIR}
cp -R ${PROTO_DIR}/* ${REACT_PROTO_CLIENT_DIR}
