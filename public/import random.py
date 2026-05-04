import random
from datetime import datetime, timedelta

# Log components
services = ["UserService", "PaymentService", "AuthService", "DatabaseService", "APIGateway", "CacheService", "NotificationService", "OrderService"]
operations = ["login", "logout", "payment_processed", "query_executed", "api_call", "cache_hit", "cache_miss", "email_sent", "order_created", "data_sync"]
error_types = ["NullPointerException", "ConnectionTimeout", "DatabaseException", "AuthenticationFailure", "InvalidInput", "OutOfMemory", "NetworkError", "ServiceUnavailable"]
error_messages = [
    "Failed to connect to database",
    "Request timeout after 30 seconds",
    "Invalid user credentials",
    "Memory limit exceeded",
    "Network connection lost",
    "Service temporarily unavailable",
    "Invalid request parameters",
    "Database query failed"
]
info_messages = [
    "Request processed successfully",
    "User authenticated",
    "Transaction completed",
    "Cache updated",
    "Data synchronized",
    "Service started successfully",
    "Configuration loaded",
    "Connection established"
]

# Generate log entries
def generate_log_entry(timestamp, level):
    service = random.choice(services)
    
    if level == "ERROR":
        error_type = random.choice(error_types)
        message = random.choice(error_messages)
        user_id = random.randint(1000, 9999)
        trace_id = f"trace-{random.randint(100000, 999999)}"
        return f"{timestamp} [{level}] {service} - {error_type}: {message} | user_id={user_id} trace_id={trace_id}"
    else:
        operation = random.choice(operations)
        message = random.choice(info_messages)
        duration = random.randint(10, 500)
        return f"{timestamp} [{level}] {service} - {operation}: {message} | duration={duration}ms"

# Generate 1200 log entries
start_time = datetime.now() - timedelta(hours=24)
log_entries = []

for i in range(1200):
    timestamp = (start_time + timedelta(seconds=i*72)).strftime("%Y-%m-%d %H:%M:%S")
    # 70% INFO, 30% ERROR logs
    level = "ERROR" if random.random() < 0.3 else "INFO"
    log_entries.append(generate_log_entry(timestamp, level))

# Write to file
with open("sample.log", "w") as f:
    f.write("\n".join(log_entries))

print(f"Generated {len(log_entries)} log entries in sample.log")
print(f"INFO logs: {sum(1 for log in log_entries if '[INFO]' in log)}")
print(f"ERROR logs: {sum(1 for log in log_entries if '[ERROR]' in log)}")