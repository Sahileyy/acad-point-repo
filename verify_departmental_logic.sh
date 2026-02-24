#!/bin/bash

# Configuration
API_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting verification of departmental logic..."

# 1. Register a student in CSE
echo -e "\n1. Registering CSE Student..."
curl -s -X POST $API_URL/auth/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "registerNumber": "CSE001",
    "name": "CSE Student",
    "semester": 5,
    "department": "CSE",
    "password": "password123"
  }' | grep -q "Registration successful" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 2. Register a faculty in CSE
echo -e "\n2. Registering CSE Faculty..."
curl -s -X POST $API_URL/auth/faculty/register \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "T_CSE01",
    "name": "Dr. CSE",
    "department": "CSE",
    "password": "password123"
  }' | grep -q "registration successful" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 3. Register a faculty in MECH
echo -e "\n3. Registering MECH Faculty..."
curl -s -X POST $API_URL/auth/faculty/register \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "T_MECH01",
    "name": "Dr. MECH",
    "department": "Mech",
    "password": "password123"
  }' | grep -q "registration successful" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 4. Verify CSE Faculty can see CSE Student
echo -e "\n4. Verifying CSE Faculty sees CSE Student..."
curl -s -X GET "$API_URL/users/students?department=CSE" | grep -q "CSE Student" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

# 5. Verify MECH Faculty cannot see CSE Student
echo -e "\n5. Verifying MECH Faculty does NOT see CSE Student..."
curl -s -X GET "$API_URL/users/students?department=Mech" | grep -q "CSE Student" && echo -e "${RED}FAILED${NC}" || echo -e "${GREEN}SUCCESS${NC}"

# 6. Verify CSE Student can see CSE Faculty
echo -e "\n6. Verifying CSE Student sees CSE Faculty..."
curl -s -X GET "$API_URL/users/teachers?department=CSE" | grep -q "Dr. CSE" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${RED}FAILED${NC}"

echo -e "\nVerification complete."
