export interface BaseActionCreator {type: string}

export interface SetSignedInAC extends BaseActionCreator {user: firebase.User}
export interface SetSignedOutAC extends BaseActionCreator {}
export interface StartSignOutAC extends BaseActionCreator {}
export interface SignOutFailAC extends BaseActionCreator {}