import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntentOptions, WebIntent } from '@ionic-native/web-intent/ngx';
import { AlertController, Platform } from '@ionic/angular';
declare let window: any;


@Component({
	selector: 'app-folder',
	templateUrl: './folder.page.html',
	styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
	public folder: string;
	eventReference: number;
	intentResponse: {
		eventReference: number,
		phone: string,
		name: string,
		amount: number
		paid: boolean
	} = {
		amount: null,
		eventReference: null,
		name: null,
		paid: null,
		phone: null
	};
	intentResponseReceived = false;
	intentSenderForm: FormGroup = new FormGroup({
		phone: new FormControl('07084677075', [Validators.required, Validators.pattern('[0]{1}[7-9]{1}[0-1]{1}[0-9]{8}')]),
		name: new FormControl('Johnvict', [Validators.required])
	});

	constructor(
		private webIntent: WebIntent,
		private alertCtrl: AlertController,
		private ngZone: NgZone) { }

	ngOnInit() {
		//
		console.log('HEY onInit WORKS!');
		this.registerReceiver();
	}

	registerReceiver() {
		this.webIntent.registerBroadcastReceiver({
			filterActions: [
				'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION',
				'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION_2'
			]
		}).subscribe((intent) => {
			if (intent.extras.eventReference === this.eventReference && intent.package === 'com.devpitch.intent.sender') {
				this.ngZone.run( () => {
					this.intentResponse = intent.extras;
					this.intentResponseReceived = true;
				});

				const options: IntentOptions = {
					action: 'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION',
					package: 'com.devpitch.intent.receiver',
					extras: { exitApp: true }
				};
				this.webIntent.sendBroadcast(options);
			}
		});
	}

	sendIntent() {
		this.eventReference = Date.now();
		const options: IntentOptions = {
			action: 'com.darryncampbell.cordova.plugin.intent.ACTION',
			requestCode: this.eventReference,
			package: 'com.devpitch.intent.receiver',
			extras: {
				...this.intentSenderForm.value,
				eventReference: this.eventReference,
				name: 'John Doe'
			}
		};

		this.webIntent.startActivityForResult(options)
			.then( _ => {
				const onResponse = (result) => {
					console.log('WE GOT RESULT');
					console.log(result);
				};
				window.plugins.intentShim.onActivityResult(onResponse);
				this.webIntent.onIntent().subscribe(onResponse);

			})
			.catch(error => this.showAltert(error));
	}

	async showAltert(message) {
		const alert = await this.alertCtrl.create({
			buttons: [{ text: 'Close', role: 'cancel' }],
			header: 'Error occured',
			message: typeof message === 'object' ? JSON.stringify(message) : message
		});
		alert.present();
	}
}
