---
title: Editing Wikidata
summary: >
  Wikidata's data model, and how to edit Wikidata
date_created: 2026-01-30
no_index: false
path: /docs/contribute/wikidata/
---

<!-- TODO: Table of Contents -->

# How to contribute to Wikidata

From [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page):

<!-- TODO: style blockquote -->

> Wikidata is a free and open knowledge base that can be read and edited by both humans and machines.

You may be one of those humans, and OpenSanctions is one of those machines: each time our Wikidata crawler runs, political positions are identified, as are any holders of those positions. So, assuming the position meets our inclusion criteria, any position or related person you’ve added or changed will be included on EveryPolitician after the next crawler run.

<div class="alert alert-info">
    <ul>
        <li>
            <a href="/docs/methodology">Our methodology</a>
        </li>
        <li>
            <a href="https://www.opensanctions.org/datasets/wikidata/">OpenSanctions’ Wikidata dataset</a>
        </li>
        <li>
            <a href="https://github.com/opensanctions/opensanctions/tree/main/datasets/_wikidata">The Wikidata crawler</a>
        </li>
    </ul>
</div>

# Wikidata’s data model

Wikidata represents everything in terms of **Items**, each of which gets an identifier that starts with Q. Items get labels, descriptions, and aliases, as well as any number of statements (more on those below).

Wikidata Items are thus roughly equivalent to Position and Person entities in OpenSanctions. But where OpenSanctions uses the Occupancy entity for linking a politician and a political position, Wikidata uses a ‘position held’ statement about a person. (See [our methodology](/docs/methodology/#concepts) for details on our data model.)

**Statements** in Wikidata are essentially properties with values. Each **property** has an identifier starting with P, and **values** can be a date or, most often, another Item. They’re rarely free text. (Values can also get optional qualifiers and references — more on that later.) Most Items we’ll be working with are [instances of](https://www.wikidata.org/wiki/Property:P31) another Item — this is an example of a property of a statement, as is [position held](https://www.wikidata.org/wiki/Property:P39).

<div class="alert alert-secondary">
    Something to wrap your head around is that if you know the value of a property but can’t link to it, you may need to create that Item first. More on that in the <a href="#editing">guide</a> below.
</div>

- **Political positions** are instances of [position](https://www.wikidata.org/wiki/Q4164871), can be subclasses of certain other positions and/or part of a certain legislature, and usually have at least a country and a jurisdiction.
  [President of Kenya](https://www.wikidata.org/wiki/Q14784066), [Member of Provincial Parliament of Western Cape](https://www.wikidata.org/wiki/Q6814209), and [Mayor of New York City](https://www.wikidata.org/wiki/Q785304) are examples.

    <div class="alert alert-secondary">
        💡 While a search for ‘member of parliament Kenya’ yields more than 450 results on Wikidata, no such position exists yet.
    </div>

- **Politicians** are instances of [human](https://www.wikidata.org/wiki/Q5), with an [occupation]() of [politician](https://www.wikidata.org/wiki/Q82955). They needn’t have a [position held](https://www.wikidata.org/wiki/Property:P39) property, **but if they don’t they won’t be included on EveryPolitician**. They can also have other properties, like a [date of birth](https://www.wikidata.org/wiki/Property:P569), [sex or gender](https://www.wikidata.org/wiki/Property:P21), and [country of citizenship](https://www.wikidata.org/wiki/Property:P27), which are good to have for a fuller picture.
- The [**position held**](https://www.wikidata.org/wiki/Property:P39) statement on a politician needs to link to an existing position, and should ideally have a start date and, if they don’t currently hold the position, an end date. They can also contain other details, like a parliamentary group. This is the main property we care about for every politician Item, as its value links the politician to a political position.

<div class="alert alert-info">
    Wikidata allows for an almost 1:1 level of granularity — you can go as deep as you like into any of these rabbit holes. We’re assuming that you want to add or fix one to a handful of missing or incorrect entries for posterity and/or your future use. If that isn’t the case, maybe check the <a href="https://www.opensanctions.org/faq/172/">FAQ</a> to see if you should be doing something else. If you’re an even bigger nerd than we thought, here are some places where you can start diving deeper into Wikidata:
    <ul class=mt-1>
        <li>
            <a href="https://www.wikidata.org/wiki/Wikidata:Tours">Wikidata Tours</a> — interactive tutorials on Items, Statements, and References
        </li>
        <li>
            <a href="https://www.wikidata.org/wiki/Wikidata:WikiProject_Govdirectory">The Govdirectory WikiProject</a> — positions
        </li>
        <li>
            <a href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician">The every politician WikiProject</a> — politicians
        </li>
    </ul>
</div>

# <a id="editing"></a> Editing Wikidata

The following guides should help you get started in the case of a politician being missing from EveryPolitician, if they’re there but their information is incorrect, or if someone shouldn’t in fact be on EveryPolitician.

Our focus in these guides is on creating the relevant items and linking them, but if you’re trying to correct or add missing information, they should help too.

For clarity, the following are required for a politician to be included on EveryPolitician, if they aren’t in [another source](https://www.opensanctions.org/pep/#sources) that OpenSanctions tracks:

<div class="alert alert-warning">
    If they’re in one of those other sources, which are also automatically ingested but not easily editable, updating them on Wikidata might not solve your problem.
</div>

- They must have a Wikidata Item
- Their [instance of](https://www.wikidata.org/wiki/Property:P31) must be [human](https://www.wikidata.org/wiki/Q5)
- Their [occupation](https://www.wikidata.org/wiki/Property:P106) must be [politician](https://www.wikidata.org/wiki/Q82955)
  <!-- TODO: fact check -->
- Their [country of citizenship](https://www.wikidata.org/wiki/Property:P27) must match the position of their position held, with the exception of dipllomatic positions
- Their Wikidata entry must be linked, via a [position held](https://www.wikidata.org/wiki/Property:P39) statement, to a political position
- Time logic — position held:
  - If the role is the head of a government, the position held may have an end time but it must be in the past 50 years (this is the longest we keep people for)
  - If the role is in national or international government or diplomatic, it may have an end time but it must be in the past 20 years
  - For all other roles, it may have an end date but it must be in the past 5 years
  - If the position held doesn't have an end time, the start time can't be more than 40 years ago
- Time logic — the person:
  - If they have a [date of death](https://www.wikidata.org/wiki/Property:P570), it must be in the past 5 years
  - They must not be older than 110 years, or we assume that even if they're still alive they're probably not in office
- Time logic — the position:
  - If the position has an associated [dissolved, abolished or demolished date](https://www.wikidata.org/wiki/Property:P576) or [end time](https://www.wikidata.org/wiki/Property:P582), it must be within the relevant cutoff period (see above)

## <a id="linking"> Linking a politician to a political position

This assumes that both the politician and their position exist as Wikidata Items. If that isn’t the case, they’ll need to be created first.

- Open the politician’s Wikidata page and click **add statement**.
- Start typing and select [position held](https://www.wikidata.org/wiki/Property:P39) for the property.
- Start typing and select the position.
  - Make sure it’s a position: ‘parliament’ or the name of a specific parliament or country are wrong, since those aren’t positions. (You can double-check that its [instance of](https://www.wikidata.org/wiki/Property:P31) is [position](https://www.wikidata.org/wiki/Q4164871) if you’re unsure.)
  - Be specific: ‘president’ or ‘member of parliament’ are probably too broad. (You’ll likely find that the position you want is a subclass of one of these broader concepts.)
  - Searching in another tab and pasting the Q-id into the dropdown can be a bit more successful than filtering, if too many or not the right options appear for you.
      <!-- TODO: get images working -->
      <figure>
          <img src="./images/position-held-no-match.png"
              alt="‘Member of South African National Assembly’ gives a `No match was found` result.">
          <figcaption>Oh no! I’m going to have to create this position, what a drag!</figcaption>
      </figure>
      <figure>
          <img src="./images/position-held-match-found.png"
              alt="Pasting in the correct Q-id gives the correct position name, ‘member of the National Assembly of South Africa’.">
          <figcaption>Like how was I supposed to guess that 🙄</figcaption>
      </figure>
- Click **add qualifier** and admire the long list of properties available for [position held](https://www.wikidata.org/wiki/Property:P39). The ones we care about especially are:
  - [start time](https://www.wikidata.org/wiki/Property:P580): the date on which the politician started in the role. (If the exact date isn’t known, you can also give the month and year, or just the year.)
  - [end time](https://www.wikidata.org/wiki/Property:P582): the last day on which they were in this position.
- Click **add reference** below your qualifiers, if you have an authoritative source URL.
  - Start typing and select [reference URL](https://www.wikidata.org/wiki/Property:P854).
  - Paste in the URL.
- Click **publish**!

<figure>
    <img src="./images/position-held-qualified-with-reference.png"
        alt="A ‘position held’ statement as described previously, this time with start and end times of 2000 and 2010 added, as well as a reference URL">
    <figcaption>Note that, depending on the type of the position, this politician might not be included on EveryPolitician, since they left office in 2010.</figcaption>
</figure>

## Creating a new Item for a politician

- Start at https://www.wikidata.org/wiki/Special:NewItem.
- Use the politician’s full name as the label.
- Optionally include a description, but use something like ‘French politician’ rather than ‘president of France’, since their title will likely change over time.
- You can also add one or more aliases if you happen to know any.

![A ‘Create a new Item’ form with example data filled in](./images/new-item-politician.png)

- Click **Create** and you’ll be taken to the page for that Item for further editing.
- Click **add statement** to start filling in some basic details about the politician. In all of these cases other than a date, start typing the property or value and select it from the dropdown.
  - [instance of](https://www.wikidata.org/wiki/Property:P31): [human](https://www.wikidata.org/wiki/Q5)
  - [occupation](https://www.wikidata.org/wiki/Property:P106): [politician](https://www.wikidata.org/wiki/Q82955)
  - [country of citizenship](https://www.wikidata.org/wiki/Property:P27)
  - [date of birth](https://www.wikidata.org/wiki/Property:P569) (if you know it)

  ![Unpublished statements about a politician as described above](./images/politician-statements.png)

- You need to **publish** each of the statements you’ve added.

Here are two examples of existing politicians on Wikidata, if you want to check what you’ve done against them: https://www.wikidata.org/wiki/Q3052772; https://www.wikidata.org/wiki/Q64008758.

The Wikidata Item for the politician exists now. Great! Next you’ll have to [link them to a political position](#linking), so that they’ll be added to EveryPolitician.

## Creating a new Item for a position

As demonstrated in the section on [linking a politician to a political position](#linking), the position might well already exist. Try searching a few different ways before creating a new Item, so that you don’t end up with two positions that mean the same thing.

<div class="alert alert-info">
    The cool people over at the <a href="https://www.wikidata.org/wiki/Wikidata:WikiProject_Govdirectory">Govdirectory WikiProject</a> are working on mapping political positions. Please defer to their expertise when it comes to political positions.
</div>

- Start at https://www.wikidata.org/wiki/Special:NewItem.
- Use the position’s name as the label. Be as specific as you can, and use the name as it’s used by that government. (You can add labels in [other languages](https://www.wikidata.org/wiki/Help:Multilingual) once the page exists.)
- Optionally add a short description and any aliases.
- Click **Create** and you’ll be taken to the page for that Item for further editing.
- Click **add statement** to start filling in some basic details about the position.
  - [instance of](https://www.wikidata.org/wiki/Property:P31): [position](https://www.wikidata.org/wiki/Q4164871)
  - [subclass of](https://www.wikidata.org/wiki/Property:P279): an existing position, if relevant
  - [native label](https://www.wikidata.org/wiki/Property:P1705): the label in its official or original language, if relevant
  - [part of](https://www.wikidata.org/wiki/Property:P361): an existing legislature, or government, if relevant
  - [country](https://www.wikidata.org/wiki/Property:P17): the country
  - [applies to jurisdiction](https://www.wikidata.org/wiki/Property:P1001): especially relevant for subnational positions
- You need to **publish** each of the statements you’ve added.

Examples: https://www.wikidata.org/wiki/Q6814209, https://www.wikidata.org/wiki/Q191954.

The Wikidata Item for the position exists now. Great! Now you can [link a politician to it](#linking), so that they’ll be added to EveryPolitician.

Happy editing! 🧚

## One last thing

These guides were written by a person (hi!). I've attempted to translate parts of our codebase and Wikidata's model of the world into English, to help you improve EveryPolitician if that's what you want to do. If I got something wrong, or made things more confusing than they ever needed to be, come and let me know over at the [forum](https://discuss.opensanctions.org/c/every-politician/). Thanks!
