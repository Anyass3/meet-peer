### Running the project

, install dependencies and run the project in development mode:

```bash
npm install # or yarn
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Open it and click around.

# Stun/Turn server setup

This is a basic setup that should work for webrtc.

## method 1

```
sudo apt-get update
sudo apt-get install coturn

```


edit /etc/turnserver.conf and uncomment the following and changing the ones in bold.
```
#listening-ip=Your Private IP // if you have one else it defaults to listenting to all ipv4 ipv6 addresses

#external-ip=Your Public IP

#listening-port=3478 thisis the default

#user=username1:password1 // this can be used to as credentails for turn server

#fingerprint

#realm=Your Domain/subdomain name // defaults to empty

#verbose


if #no-loopback-peers uncomment it

#lt-cred-mech
```

## method2

if you have python3 installed

just run:
`npm run setup_turn`

and follow the setup and you are done

## You can now start the server as:

```

    sudo turnserver -o -a -f
    OR
    systemctl start coturn
*** stun/turn server is ready ***
to run coturn as a service:
    uncomment the following line in '/etc/default/coturn' file
    '#TURNSERVER_ENABLED=1'

example ice config:

 iceConfig: {
    iceServers: [
        { urls: 'stun:public_ip:3478' },
        {
        urls: 'turn:public_ip:3478',
        username: 'username',
        credential: 'password',
        },
        ],
    },
```

if you have a fully funtional domain name:

    you may create a subdomain for your server.

    eg: turn.my_domain.com

Your domain or sub-domain should resolve your stun/Turn server's external_ip/public_ip

also you may need to use let's encrypt to generate free tls certificates perhaps you know better than me.

then you will have to uncommemt

    #cert > cert /etc/letsencrypt/sub_domain.domain.com/cert.pem OR to your_path if it's different

    #pkey > pkey /etc/letsencrypt/sub_domain.domain.com/privkey.pem

Then your urls will be turn:sub_domain.domain.com:3478 and stun:sub_domain.domain.com:3478
