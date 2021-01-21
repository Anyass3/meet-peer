#!/usr/bin/python3
# turn_config_path=input('Please input the turn config file')
import re
def setup():
    print('''

    This is a basic setup that should work for webrtc.

    ''' )
    can_start= not input('***press ENTER_KEY to start*** OR any other key to cancel for now: ')

    def read_config_file(path='/etc/turnserver.conf'):
        with open(path) as f:
            config = f.read()
        return config.split('\n')

    def get_configs():
        print('''
            This is a basic stun/turn setup meant for well I don't know :)

            ***starting setup***

        ''' )
        input('Press enter to continue ')
        print()

        username = input('Please input a USERNAME to use with the turn server: ')
        while not username: username = input('Please input a USERNAME to use with the turn server: ')
        print()

        password = input('Please input a PASSWORD to use with the turn server: ')
        while not password: password = input('Please input a PASSWORD to use with the turn server: ')
        print()
        
        realm = input('Please input your realm (this is your domain name)(eg: company.com): ')
        while not realm: realm = input('Please input your realm (this is your domain name)(eg: company.com): ')
        print()
        
        external_ip = input('Please input your server\'s external/public IP address: ')
        while not external_ip: external_ip = input('Please input your server\'s external/public IP address: ')
        print()

        ip= input('Please input your listening IP (This can be your server instance IP/private IP if you have one)(defaults to 0.0.0.0).Press enter for default: ') or '0.0.0.0'
        print()
        port = input('Please input the server listening-port. This defaults to 3478. Press enter for default: ') or 3478
        print()

        print()

        return [('#listening-ip=172.17.19.101', f'listening-ip={ip}'),('^#external-ip=[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$', f'#external-ip={external_ip}'), ('#listening-port=3478', f'listening-port={port}'),
                ('#user=username1:password1',f'user={username}:{password}'),
            ('#fingerprint','fingerprint'), ('#realm=mycompany.org', f'realm={realm}'),('#verbose','verbose'),
                ('#allow-loopback-peers', 'no-loopback-peers'),('#no-loopback-peers', 'no-loopback-peers'),('#lt-cred-mech','lt-cred-mech')]

    def set_configs():
        configs_file=read_config_file()
        configs = get_configs()
        for index, line in enumerate(configs_file):
            for config in configs:
                if re.match(config[0],line):
                    print('line',index,line,'uncommented')
                    configs_file[index] = config[1]
        
        return configs_file

    def generate_config():
        configs = set_configs()
        configs = '\n'.join(configs)
        return configs

    def write_config(path='/etc/turnserver.conf'):
        generated_config = generate_config()
        with open(path, 'w') as f:
            f.write(generated_config)
    if can_start:
        write_config()
        print()
        print('config as been writen')
        print('''

            Very basic setup completed. This should work for webrtc

            Please checkout the config file. It is very well documented.

            you can now start the server as:

                sudo turnserver -o
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

            if you have a fully funtional domain name:
                you can create a subdomain for your server.
                eg: turn.my_domain.com
            Your domain or sub-domain should resolve stun/Turn server's external_ip/public_ip
            also you may need to use let's encrypt to generate free tls certificates perhaps you know better than me.
            then you will have to uncommemt 

                #cert > cert /etc/letsencrypt/sub_domain.domain.com/cert.pem OR to your_path if it's different
                #pkey > pkey /etc/letsencrypt/sub_domain.domain.com/privkey.pem

            Then your urls will be turn:sub_domain.domain.com:3478 and stun:sub_domain.domain.com:3478
        ''' )
        print('''
        **** DONE ! ****
        ''' )



setup()

