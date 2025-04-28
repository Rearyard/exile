// --detail comments for visibility
// --0: The fandom is visible to everyone
// --1: The fandom is visible to logged in users
// --start from here, the fandom can not be searched by name
// --2: The fandom is only visible to the users who subscribe the fandom(limited visibility)
// --3: The fandom is only visible to the users who has already created works of the fandom(soft ban)
// --4: The fandom is only visible to the user itself(hard ban, can not be seen by anyone else)

export enum FandomVisibility {
    // The fandom is visible to everyone
    PUBLIC = 0,
    // The fandom is visible to logged in users
    LOGGED_IN = 1,
    // The fandom is only visible to the users who subscribe the fandom(limited visibility)
    LIMITED = 2,
    // The fandom is only visible to the users who has already created works of the fandom(soft ban)
    SOFT_BAN = 3,
    // The fandom is only visible to the user itself(hard ban, can not be seen by anyone else)
    HARD_BAN = 4,
}