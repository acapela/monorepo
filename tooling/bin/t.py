#!/usr/bin/env python3

import sys
import os
import sqlite3
import plistlib
import argparse
import time

parser = argparse.ArgumentParser()
parser.add_argument('-e', '--enable', help='Enable App Function', action='store_true')
parser.add_argument('-d', '--disable', help='Disable App Function', action='store_true')
parser.add_argument('-r', '--remove', help='Remove Record of App Function', action='store_true')
parser.add_argument('-id', '--bundleid', help='Defines App Bundle ID')
parser.add_argument('-p', '--apppath', help='Defines App Path to automatically find Bundle ID')
parser.add_argument('-n', '--appname', help='Defines App Name to automatically find Bundle ID (if app is stored in /Applications/, else, please use --apppath)')
parser.add_argument('--contacts', help='Change Contacts Access Status for the selected app', action='store_true')
parser.add_argument('--calendars', help='Change Calendars Access Status for the selected app', action='store_true')
parser.add_argument('--reminders', help='Change Reminders Access Status for the selected app', action='store_true')
parser.add_argument('--photos', help='Change Photos Access Status for the selected app', action='store_true')
parser.add_argument('--camera', help='Change Camera Access Status for the selected app', action='store_true')
parser.add_argument('--microphone', help='Change Microphone Access Status for the selected app', action='store_true')
if len(sys.argv) == 1:
    parser.print_usage()
    parser.exit()
args = parser.parse_args()
tcc_db_path = '~/Library/Application Support/com.apple.TCC/TCC.db'
tcc_db_path = os.path.abspath(os.path.expanduser(tcc_db_path))


def is_root():
    return os.geteuid() == 0


def readPlist(path):
    with open(path, 'rb') as plist_file:
        return plistlib.load(plist_file)

def modify_tcc_db(service, client, client_type, auth_value):
    conn = sqlite3.connect(tcc_db_path)
    cursor = conn.cursor()
    if auth_value < 0:
        cursor.execute(
            'delete from access where service = ? and client = ? and client_type = ?;',
            (service, client, client_type)
        )
    else:
        cursor.execute(
            'insert or replace into access (service, client, client_type, auth_value, auth_reason, ' + \
            'auth_version, csreq, policy_id, indirect_object_identifier_type, indirect_object_identifier, ' + \
            'indirect_object_code_identity, flags, last_modified) ' + \
            'values(?, ?, ?, ?, 0, 1, null, null, 0, \'UNUSED\', null, 0, ?);',
            (service, client, client_type, auth_value, int(time.time()))
        )
    cursor.close()
    conn.commit()
    conn.close()


if not is_root():
    print('You are not allowed to do this operation.')
    exit(1)
if args.bundleid:
    appBundleId = args.bundleid
elif args.apppath:
    info_plist_path = args.apppath + '/Contents/Info.plist'
    if os.path.isfile(info_plist_path):
        print('Found a macOS app.')
    else:
        info_plist_path = args.apppath + '/Info.plist'
        if os.path.isfile(info_plist_path):
            print('Found an iOS app.')
    appPlist = readPlist(info_plist_path)
    appBundleId = appPlist['CFBundleIdentifier']
elif args.appname:
    info_plist_path = '/Applications/' + args.appname + '/Contents/Info.plist'
    if os.path.isfile(info_plist_path):
        print('Found a macOS app.')
    else:
        info_plist_path = '/Applications/' + args.appname + '/Info.plist'
        if os.path.isfile(info_plist_path):
            print('Found an iOS app.')
    appPlist = readPlist(info_plist_path)
    appBundleId = appPlist['CFBundleIdentifier']
else:
    appPath = input('Drag the application here: ').strip()
    appPath = appPath.replace('\\', '\0').replace('\0\0', '\\').replace('\0', '')
    info_plist_path = appPath + '/Contents/Info.plist'
    if os.path.isfile(info_plist_path):
        print('Found a macOS app.')
    else:
        info_plist_path = appPath + '/Info.plist'
        if os.path.isfile(info_plist_path):
            print('Found an iOS app.')
    appPlist = readPlist(info_plist_path)
    appBundleId = appPlist['CFBundleIdentifier']
if args.enable:
    if args.contacts:
        modify_tcc_db('kTCCServiceAddressBook', appBundleId, 0, 2)
        print('Allowed the app to access Contacts!')
    if args.calendars:
        modify_tcc_db('kTCCServiceCalendar', appBundleId, 0, 2)
        print('Allowed the app to access Calendars!')
    if args.reminders:
        modify_tcc_db('kTCCServiceReminders', appBundleId, 0, 2)
        print('Allowed the app to access Reminders!')
    if args.photos:
        modify_tcc_db('kTCCServicePhotos', appBundleId, 0, 2)
        print('Allowed the app to access Photos!')
    if args.camera:
        modify_tcc_db('kTCCServiceCamera', appBundleId, 0, 2)
        print('Allowed the app to access Camera!')
    if args.microphone:
        modify_tcc_db('kTCCServiceMicrophone', appBundleId, 0, 2)
        print('Allowed the app to access Microphone!')
if args.disable:
    if args.contacts:
        modify_tcc_db('kTCCServiceAddressBook', appBundleId, 0, 0)
        print('Disallowed the app to access Contacts!')
    if args.calendars:
        modify_tcc_db('kTCCServiceCalendar', appBundleId, 0, 0)
        print('Disallowed the app to access Calendars!')
    if args.reminders:
        modify_tcc_db('kTCCServiceReminders', appBundleId, 0, 0)
        print('Disallowed the app to access Reminders!')
    if args.photos:
        modify_tcc_db('kTCCServicePhotos', appBundleId, 0, 0)
        print('Disallowed the app to access Photos!')
    if args.camera:
        modify_tcc_db('kTCCServiceCamera', appBundleId, 0, 0)
        print('Disallowed the app to access Camera!')
    if args.microphone:
        modify_tcc_db('kTCCServiceMicrophone', appBundleId, 0, 0)
        print('Disallowed the app to access Microphone!')
if args.remove:
    if args.contacts:
        modify_tcc_db('kTCCServiceAddressBook', appBundleId, 0, -1)
        print('Removed app access to Contacts!')
    if args.calendars:
        modify_tcc_db('kTCCServiceCalendar', appBundleId, 0, -1)
        print('Removed app access to Calendars!')
    if args.reminders:
        modify_tcc_db('kTCCServiceReminders', appBundleId, 0, -1)
        print('Removed app access to Reminders!')
    if args.photos:
        modify_tcc_db('kTCCServicePhotos', appBundleId, 0, -1)
        print('Removed app access to Photos!')
    if args.camera:
        modify_tcc_db('kTCCServiceCamera', appBundleId, 0, -1)
        print('Removed app access to Camera!')
    if args.microphone:
        modify_tcc_db('kTCCServiceMicrophone', appBundleId, 0, -1)
        print('Removed app access to Microphone!')
