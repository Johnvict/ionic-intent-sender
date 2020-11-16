import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-folder',
	templateUrl: './folder.page.html',
	styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
	public folder: string;
	intentSenderForm: FormGroup = new FormGroup({
		phone: new FormControl('', [Validators.required, Validators.pattern('[0]{1}[7-9]{1}[0-1]{1}[0-9]{8}')]),
		name: new FormControl('Johnvict', [Validators.required])
	});

	constructor() { }

	ngOnInit() {
		//
	}

	sendIntent() {
		//
	}
}
