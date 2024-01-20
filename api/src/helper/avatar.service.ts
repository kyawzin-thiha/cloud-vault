import { Injectable } from '@nestjs/common';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/big-ears-neutral';

@Injectable()
export class AvatarService {
	generateAvatar(username: string) {
		return createAvatar(style, {
			seed: username,
		});
	}
}