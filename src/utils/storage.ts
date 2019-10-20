import { Bucket } from '@google-cloud/storage';
import { Constants } from './constants';
import { BaseError } from './error.handler';
import firebase from 'firebase-admin';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';
import UUID from 'uuid/v4';

firebase.initializeApp({
	credential: firebase.credential.cert(JSON.parse(Constants.FIREBASE_SERVICE_ACCOUNT)),
	storageBucket: Constants.STORAGE_BUCKET
});


const bucket = firebase.storage().bucket()

/**
 * upload a base64 image to firebase
 * @param  {string} base64String
 * @param  {string} filename
 * @param  {string='image/jpeg'} mimeType
 * @param {string='data:image/jpeg;base64,'} encoding
 */
export const upload = (
	base64String: string,
	filename: string,
	mimeType: string = 'image/jpeg',
	encoding: string = 'data:image/jpeg;base64,',
	errorCallback?: (error: any) => void
) => {
	if(base64String.slice(0, 4) === 'data'){
		mimeType = base64String.slice(11, 12) === 'j'? 'image/jpeg': 'image/png' 
		encoding = `data:${mimeType};base64,`
	}
	base64String = base64String.replace(encoding, '');

	// @ts-ignore
	const imageBuffer = new Buffer.from(base64String, 'base64');
	const uuid = UUID(); // generate firebase download token

	// Upload the image to the bucket
	const file = bucket.file(filename);
	file.save(
		imageBuffer,
		{
			metadata: {
				contentType: mimeType,
				metadata: {
					firebaseStorageDownloadTokens: uuid
				}
			}
		},
		error => {
			if (error) {
				console.log(error)
				// tslint:disable-next-line: no-unused-expression
				errorCallback && errorCallback(new BaseError('Failed to upload image'));
			}
		}
	);
	return createPublicFileURL(filename, uuid);
};

/**
 * generate public url for file
 * @param  {string} path
 * @param  {string} uuid
 */
const createPublicFileURL = (path: string, uuid: string) => {
	return `https://firebasestorage.googleapis.com/v0/b/${
		bucket.name
		}/o/${encodeURIComponent(path)}?alt=media&token=${uuid}`;
};