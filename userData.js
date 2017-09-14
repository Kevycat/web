var profile;
var init = function(){
	return googleUser.getBasicProfile();
}
var getId = function(){
	return profile.getId();
}
var getName = function(){
	return profile.getName();
}
var getImageUrl = function(){
	return profile.getUrl();
}
var getEmail = function(){
	return profile.getEmail();
}