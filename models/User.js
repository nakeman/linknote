// 模块都是从「程序全局」上的截取片段
// 所以直可执行代码（改变程序状态的语句），本地变量符号只在本模块内可看

    let users = [];
    export let UsersSchema = {};

    class User{
        constructor(nid,email,password){
            this._id = nid;
            this._email = email;
            this._password = password;
        }

        get id (){
            return this._id;
        }

        set id(nid){
            this._id = nid;
        }

        get email (){
            return this._email;
        }

        set email(nemail){
            this._email = nemail;
        }

        get password (){
            return this._password;
        }

        set password(npassword){
            this._password = npassword;
        }

        matchPassword(password){
            return this.password === password;
        }

    }

    users.push(new User(1,'keminlau@hotmail.com','keminlau'));
    users.push(new User(2,'nakeman@hotmail.com','nake1234'));
    users.push(new User(3,'chenchen@hotmail.com','chenchen3214'));
    users.push(new User(4,'lululiu@hotmail.com','lululiu1234'));


    // 函数内也是可执行代码，显然是在个特定的执行环境上
    UsersSchema.findOne = function(emailjosn) {
        return users.find( user => emailjosn.email === user.email);
        // 
    }

    UsersSchema.findById = function(id, fn){
        let user = users.find( user => user.id == id);
        if (user)  {
            fn(null,user);
        }
    }
