# Windrose Data
Welcome to the inofficial data repository for Windrose.

The repository hosts data and translations for most things in the game and is currently in the build-up, but will in the end feature information like required materials for **tools**, **building structures/elements** and various other information specific to the type of data.

> [!NOTE]
> The current release, 0.0.X, is based on the **demo** version of the game and acts as a starting point.\
> With the Early Access release will the data receive a bigger update and starts the regular version schema of 0.1.X.

## Data Structure Concept
Before using it, its important to understand that both the data and translations are structured in a **version historic** way, so each data object and translation contains its own history across the various versions. This offers the big feature of being able to load the data and translation for a specific game version on the fly via the npm package (see below).

## How to Use

### Package
Based on the data is the `windrosedata` npm package available, featuring access to the data with full types support and autocompletion.

**Installing the Package**
```
npm i @windrosetools/windrosedata
```

### Data
#### UnifiedItem
In general are all elements like items, ammunition, metals, building elements and more accessible via the `UnifiedItems` dao.
It exposes all shared properties as mandatory and those who appear only on some daos as optional fields.

```typescript
import { UnifiedItems, Version } from "@windrosetools/windrosedata";

const version: Version = "demo";
const resolvedItem = UnifiedItems[version]["homewardJourney"];
console.log(resolvedItem);

// Logs
Alchemy { // The returned element is using it's own correct type
  id: 'homewardJourney',
  rarity: 'rare',
  stackLimit: 0,
  required: {
    alchemicalBase: { id: 'alchemicalBase', amount: 3, resolved: [Object] },
    rumBottle: { id: 'rumBottle', amount: 2, resolved: [Object] },
    feather: { id: 'feather', amount: 4, resolved: [Object] },
    undeadEssence: { id: 'undeadEssence', amount: 1, resolved: [Object] }
  }
}
// Each resolved value represents the resolved required material, so you don't need
// to look them up yourself.

const { id, rarity, requiresBonfire } = resolvedItem!;
console.log("id: %s, rarity: %s, requiresBonfire: %s", id, rarity, requiresBonfire);
// id: homewardJourney, rarity: rare, requiresBonfire: undefined - requiresBonfire is an optional 
// property of UnifiedItem that is set for some building elements for example as such it appears,
// but is undefined in this case.
```

#### Direct
In addition to that can each type of element of course also be directly accessed by its corresponding dao.

```typescript
import { Alchemies, Version } from "@windrosetools/windrosedata";

const version: Version = "demo";
const data = Alchemies[version]["homewardJourney"];
console.log(data);

// Logs
Alchemy {
  id: 'homewardJourney',
  rarity: 'rare',
  stackLimit: 0,
  required: {
    alchemicalBase: { id: 'alchemicalBase', amount: 3, resolved: [Object] },
    rumBottle: { id: 'rumBottle', amount: 2, resolved: [Object] },
    feather: { id: 'feather', amount: 4, resolved: [Object] },
    undeadEssence: { id: 'undeadEssence', amount: 1, resolved: [Object] }
  }
}
```
### Translation
Based on the example above the translation data for homewardJourney can be easily retrieved by the following way:

```typescript
import { Alchemies, Languages, Version } from "@windrosetools/windrosedata";

const version: Version = "demo";
const data = Alchemies[version]["homewardJourney"];
    
const translation = Languages["EN"][version]["homewardJourney"]; // type of LanguageData
console.log(translation);

// Logs
{
  name: 'Homeward Journey',
  description: [
    'A light drink with a slightly sweet taste.',
    "Too bad it isn't easy to make -- rare ingredients are required."
  ],
  comment: [
    "To leave a midnight tavern and wake up in a sweat-soaked bed with no idea how you got there - that's magic practiced only by Tortuga's most seasoned 'wizards.'"
  ]
}
```

## Contribute
If you like the project please give it a ⭐ here on Github.

As the game is quite big every contribution is appreciated to make the data as complete as possible!

There are several ways to contribute to the project.

### Reporting wrong or outdated information
If you have noticed a wrong or outdated information please open an [Issue](https://github.com/WindroseTools/WindroseData/issues) so it can be checked and corrected quickly.

### Adding or updating information
If you want to add to or update information of the dataset, the general open source approach of a Pull Request is used.\
Which consists of creating a **Fork**, adding/updating the code in the forked repository and then creating a **Pull Request** in this repository to merge the changes of your fork into this one. Pull Requests need to made against the **nightly** branch!

## Questions
If you have any questions regarding the data or on one of the points above please use the [Windrose Tools Discord](). 