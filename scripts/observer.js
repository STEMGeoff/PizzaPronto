var Subject = function()  {
  /* Initialize list of observers */
  this._observers = [];
  /* Declare methods */
  this.Attach = function(observer) {
    if("Update" in observer) {
      var observerID = this._observers.length;
      this._observers.push(observer);
      return observerID;
    }
  };
  this.Detach = function(observerID) {
    if(observerID in this._observers) {
      delete this._observers[observerID];
    }
  };
  this.Notify = function() {
    for(var i in this._observers) {
      this._observers[i].Update(this);
    }
  };
};