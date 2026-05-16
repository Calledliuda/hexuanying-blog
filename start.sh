#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动博客..."
open http://localhost:3456
npm run dev -- -p 3456
