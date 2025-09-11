# SQL Scripts Organization

This directory contains all SQL scripts organized by their purpose and functionality.

## Directory Structure

### 📁 `debugging/`
Contains scripts for debugging and diagnosing database issues:
- **Check scripts**: `check-*.sql` - Scripts to verify database structure, policies, tables, etc.
- **Debug scripts**: `debug-*.sql` - Scripts for debugging specific issues like permissions, token generation, webhooks
- **Simple scripts**: `simple-*.sql` - Simplified debugging scripts for quick diagnostics

**Key Files:**
- `check-current-db-structure.sql` - Check current database structure
- `check-current-policies.sql` - Verify RLS policies
- `debug-reset-token-generation.sql` - Debug password reset token issues
- `simple-payment-check.sql` - Quick payment system check

### 📁 `fixes/`
Contains scripts for fixing specific database issues:
- **Add scripts**: `add-*.sql` - Scripts to add missing columns or fields
- **Fix scripts**: `fix-*.sql` - Scripts to fix specific problems
- **Complete scripts**: `complete-*.sql` - Comprehensive fix scripts

**Key Files:**
- `fix-payment-tables.sql` - Fix payment table issues
- `fix-password-resets-final.sql` - Final password reset fixes
- `add-missing-columns.sql` - Add missing database columns
- `complete-otp-fix.sql` - Complete OTP verification fix

### 📁 `tests/`
Contains scripts for testing database functionality:
- **Test scripts**: `test-*.sql` - Scripts to test API endpoints and database operations
- **Comprehensive scripts**: `comprehensive-*.sql` - Full system tests
- **Migration scripts**: `migrate-*.sql` - Step-by-step migration tests

**Key Files:**
- `test-payment-flow.sql` - Test complete payment flow
- `test-api-complete-flow.sql` - Test full API functionality
- `comprehensive-orders-fix.sql` - Comprehensive order system test

### 📁 `maintenance/`
Contains scripts for database maintenance and cleanup:
- **Cleanup scripts**: `cleanup-*.sql` - Database cleanup operations
- **Rebuild scripts**: `rebuild-*.sql` - Database rebuild operations
- **Emergency scripts**: `emergency-*.sql` - Emergency database fixes
- **Enhancement scripts**: `enhance-*.sql` - Database enhancements

**Key Files:**
- `cleanup-database.sql` - Clean up database
- `rebuild-database-clean.sql` - Rebuild database from scratch
- `emergency-bypass-rls.sql` - Emergency RLS bypass
- `secure-production-fix.sql` - Production security fixes

## Usage Guidelines

1. **Before running any script**: Always backup your database
2. **Debugging**: Start with `debugging/` scripts to identify issues
3. **Fixing**: Use `fixes/` scripts to resolve identified problems
4. **Testing**: Use `tests/` scripts to verify fixes work correctly
5. **Maintenance**: Use `maintenance/` scripts for ongoing database care

## Migration Scripts

The `migrations/` folder (separate from this organization) contains the official database migration scripts that should be run in order.

## Safety Notes

- ⚠️ **Always backup before running any script**
- ⚠️ **Test scripts in development environment first**
- ⚠️ **Review script contents before execution**
- ⚠️ **Some scripts may modify or delete data**

## Script Categories Summary

| Category | Count | Purpose |
|----------|-------|---------|
| Debugging | 26 | Diagnose and identify issues |
| Fixes | 20 | Fix specific problems |
| Tests | 8 | Test functionality |
| Maintenance | 8 | Database maintenance |
| **Total** | **62** | **All SQL scripts organized** |

---

*Last updated: $(date)*
*Total SQL scripts organized: 62*
