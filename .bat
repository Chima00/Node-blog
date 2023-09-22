@echo off
cd "c:\mongodb\bin"
start mongod.exe
timeout 4
start mongosh.exe
exit
