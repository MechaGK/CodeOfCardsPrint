#!/usr/bin/env python3
import urllib.request
import json

statements_sheet = "https://docs.google.com/spreadsheets/d/1EPGT-rQ3ZZVdwJ9ynwHImz0V8JTM4AfSguATNVqDF10/pub?gid=568311885&single=true&output=tsv"
hacks_sheet = "https://docs.google.com/spreadsheets/d/1EPGT-rQ3ZZVdwJ9ynwHImz0V8JTM4AfSguATNVqDF10/pub?gid=65795990&single=true&output=tsv"
events_sheet = "https://docs.google.com/spreadsheets/d/1EPGT-rQ3ZZVdwJ9ynwHImz0V8JTM4AfSguATNVqDF10/pub?gid=484803621&single=true&output=tsv"

# Getting statements
print("Getting statements from Google Sheets...", end=" ")
response = urllib.request.urlopen(statements_sheet)
print(response.getcode())

statements_tsv = response.read().decode("utf-8") 
print("Successfully got statements")

# Getting hacks
print("Getting hacks from Google Sheets...", end=" ")
response = urllib.request.urlopen(hacks_sheet)
print(response.getcode())

hacks_tsv = response.read().decode("utf-8") 
print("Successfully got hacks")

# Getting events
print("Getting events from Google Sheets...", end=" ")
response = urllib.request.urlopen(events_sheet)
print(response.getcode())

events_tsv = response.read().decode("utf-8") 
print("Successfully got events")

print("Generating JSON file...")
statements_list = statements_tsv.split('\r\n')
hacks_list = hacks_tsv.split('\r\n')
events_list = events_tsv.split('\r\n')

cards = []

for row in statements_list[1:]:
	statement = {}
	cells = row.strip().split('\t')

	statement["text"] = cells[0]
	statement["description"] = cells[1]
	statement["frequency"] = int(cells[2])
	statement["type"] = "statement"

	cards.append(statement)

for row in hacks_list[1:]:
	hack = {}
	cells = row.split('\t')
	hack["text"] = cells[0]
	hack["description"] = cells[1]
	hack["frequency"] = int(cells[2])
	hack["type"] = "hack"

	cards.append(hack)

for row in events_list[1:]:
	event = {}
	cells = row.split('\t')
	event["text"] = cells[0]
	event["description"] = cells[1]
	event["type"] = "event"

	cards.append(event)

jsonContent = json.dumps(cards, sort_keys=True, indent=2)

print("Saving json")
f = open('data/cards.json', 'w')
f.write(jsonContent)

print("Saved data to data/cards.json")
