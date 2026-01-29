---
title: Methodology
summary: >
  How EveryPolitician collects and organises data about political office-holders
date_created: 2025-08-16
date_updated: 2026-01-30
no_index: false
path: /docs/methodology/
---

# Methodology

This page explains how EveryPolitician collects, organises, and maintains data about political office-holders.

## 💡 The concepts we use

A **political position** is an office which can be filled by different people at different times, like the President of Ethiopia. This position is distinct from the President of France, but it remains the same position when a new person fills it.

A **politician** is a person who fills a political position at any given time.

**Occupancy** is the time-bound link between a person (specifically, a politician) and a political position.

Inspired by the [Wikidata Project EveryPolitician](https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician), OpenSanctions maps **political positions** primarily. We then fill in the details of who occupies each position at different points in time as information changes or becomes available. Our data model keeps the concepts of ‘person’ (or ‘politician’ in this case) and ‘position’ separate, and links them logically via ‘occupancy’ instances.

For the nerds: the relevant OpenSanctions schema types are [Position](https://www.opensanctions.org/reference/#schema.Position) (with a `gov` or similar topic), [Person](https://www.opensanctions.org/reference/#schema.Person) (with a `role.pep` topic), and [Occupancy](https://www.opensanctions.org/reference/#schema.Occupancy). More on [topics](https://followthemoney.tech/explorer/types/topic/).


## ⛏️ How we get and work with the data

OpenSanctions maintains a [fleet of crawlers](https://github.com/orgs/opensanctions/projects/2/views/1) than run regularly to get data about politicians from various sources.

Since the same person may well show up in multiple sources, we handily merge duplicate entities. If a politician has a [Wikidata](https://www.wikidata.org) entry, that becomes the primary entity (we also use their Wikidata identifiers in these cases).

For the nerds who care about crawlers: [https://zavod.opensanctions.org/peps/](https://zavod.opensanctions.org/peps/).

### Data sources

We collect data from several types of sources:

- **Official government websites**: Parliamentary member lists, cabinet announcements, and judicial appointments
- **International databases**: Global databases of world leaders and heads of state
- **Wikidata**: Community-maintained structured data from the Wikimedia ecosystem

All sources are [documented on our data sources page](/datasets/).

### Types

We track several categories of political positions:

#### National level

- **Executive**: Heads of state, heads of government, cabinet ministers, senior civil servants
- **Legislative**: Members of parliament, senators, representatives
- **Judicial**: Supreme court judges, constitutional court members

#### Subnational level

- **Regional executives**: Governors, premiers, chief ministers
- **Regional legislators**: State parliament members, provincial councillors
- **Local government**: Mayors, city council members

#### Other roles

- **State enterprises**: Executives of major state-owned companies
- **International bodies**: Representatives to international organisations

### Position status

For each position, we track whether it is currently occupied and by whom. Positions can have one of several statuses:

- **Current**: The person currently holds this position
- **Past**: The person previously held this position
- **Unclear**: We lack precise dates to determine current status

The "unclear" status occurs when our data sources indicate someone holds or held a position, but don't provide clear start and end dates. We're working to improve date coverage over time.

### Updates and accuracy

Data is updated automatically when our sources change. For Wikidata-sourced information, updates typically appear within a few days of edits being made.

If you spot an error, the best way to fix it is to [contribute a correction](/docs/contribute/).

## 📜 Reference

- [Politically Exposed Persons on OpenSanctions](https://www.opensanctions.org/pep/)
- [How OpenSanctions represents political office-holders](https://www.opensanctions.org/docs/pep/methodology/)
- [Entity risk tagging of politically exposed persons on OpenSanctions](https://www.opensanctions.org/docs/topics/#politically-exposed-persons)
