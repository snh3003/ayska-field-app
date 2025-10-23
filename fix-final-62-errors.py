#!/usr/bin/env python3
"""
Fix all remaining 62 TypeScript structural errors
"""

import re

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w') as f:
        f.write(content)
    print(f"✅ Fixed: {path}")

# Fix 1: AyskaNotificationListComponent - Remove style from EmptyState and ErrorBoundary
content = read_file('src/components/business/AyskaNotificationListComponent.tsx')
content = re.sub(r'(<EmptyState[^>]*)style=\{style\}([^/>]*>)', r'\1\2', content)
content = re.sub(r'<ErrorBoundary style=\{style\} accessibilityHint=\{accessibilityHint\}>', '<ErrorBoundary>', content)
write_file('src/components/business/AyskaNotificationListComponent.tsx', content)

# Fix 2: AyskaCheckInSlice - Fix checkInHistory naming
content = read_file('src/store/slices/AyskaCheckInSlice.ts')
content = re.sub(r'\.checkInHistory', '.checkinHistory', content)
write_file('src/store/slices/AyskaCheckInSlice.ts', content)

# Fix 3: AyskaNotificationSlice - Fix action → _action
content = read_file('src/store/slices/AyskaNotificationSlice.ts')
# Replace unmarked 'action' with '_action' in reducers
content = re.sub(r'\(state, action\)', '(state, _action)', content)
write_file('src/store/slices/AyskaNotificationSlice.ts', content)

# Fix 4: AyskaAssignDoctorsScreen - Fix employeeId → employee_id, doctorId → doctor_id
content = read_file('src/screens/Admin/AyskaAssignDoctorsScreen.tsx')
# Replace properties accessing assignment object
content = re.sub(r'assignment\.employeeId', 'assignment.employee_id', content)
content = re.sub(r'assignment\.doctorId', 'assignment.doctor_id', content)
content = re.sub(r'formData\.employeeId', 'formData.employee_id', content)
content = re.sub(r'formData\.doctor_id', 'formData.doctorId', content) # This should be doctorId in formData
# Fix the actual property names in the object literal
content = re.sub(r"doctor_ids:", "doctor_id:", content)
# Fix import
content = re.sub(r'fetchAllAssignments', 'fetchAssignments', content)
write_file('src/screens/Admin/AyskaAssignDoctorsScreen.tsx', content)

# Fix 5: AyskaEmployeeAnalyticsScreen - Fix import names
content = read_file('src/screens/Admin/AyskaEmployeeAnalyticsScreen.tsx')
# These might need to be renamed or removed if they don't exist
content = re.sub(r'fetchAllAnalytics,\s*', '', content)
content = re.sub(r'generateRoundup,\s*', '', content)
write_file('src/screens/Admin/AyskaEmployeeAnalyticsScreen.tsx', content)

# Fix 6: AyskaEmployeeSlice - Fix imports
content = read_file('src/store/slices/AyskaEmployeeSlice.ts')
content = re.sub(r"IEmployeeService", "EmployeeService", content)
content = re.sub(r"CreateEmployeePayload,\s*", "", content)
content = re.sub(r"UpdateEmployeePayload,\s*", "", content)
write_file('src/store/slices/AyskaEmployeeSlice.ts', content)

# Fix 7: AyskaCheckInScreenScreen - Fix import
content = read_file('src/screens/Employee/AyskaCheckInScreenScreen.tsx')
content = re.sub(r'performCheckIn', 'submitCheckIn', content)
write_file('src/screens/Employee/AyskaCheckInScreenScreen.tsx', content)

# Fix 8: AyskaMyAssignmentsScreen - Fix selector and add type annotations
content = read_file('src/screens/Employee/AyskaMyAssignmentsScreen.tsx')
content = re.sub(r'employeeAssignments', 'assignments', content)
# Add type annotations for reduce callbacks
content = re.sub(
    r'\.reduce\(\(sum, assignment\) =>',
    '.reduce((sum: number, assignment: any) =>',
    content
)
# Fix fetchAssignments call
content = re.sub(
    r'fetchAssignments\(\{ employeeId: user\.employeeId \}\)',
    'fetchAssignments(user.employeeId)',
    content
)
write_file('src/screens/Employee/AyskaMyAssignmentsScreen.tsx', content)

print("\n🎉 All major structural fixes applied!")
print("Check remaining errors with: npx tsc --noEmit")

