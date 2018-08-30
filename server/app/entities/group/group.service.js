const async = require('async');
const _ = require('lodash');
const GroupRepository = require('./group.repository');

class GroupService {
	constructor() {
		this.GroupRepository = GroupRepository;
	}

	saveGroup(obj) {
		return this.GroupRepository.saveGroup(obj);
	}

	saveFullGroup(obj, res) {
		return new Promise((resolve, reject) => {
			async.waterfall(
				[
					callback => {
						// check name duplicates
						this.findAllFullUserGroups({
							userId: res.locals.user.id,
							name: obj.name
						})
							.then(data => {
								if (data.length === 0) {
									return callback(null);
								}
								throw new Error('Folder with such name already exists');
							})
							.catch(err => callback(err, null));
					},
					callback => {
						// todo: omit unnecessary fields from payload
						this.GroupRepository.saveGroup(obj)
							.then(data => callback(null, data.dataValues))
							.catch(err => callback(err, null));
					},
					(group, callback) => {
						this.GroupRepository.saveGroupUser(
							{
								groupId: group.id,
								userId: res.locals.user.id,
								defaultGroup: false
							}
						)
							.then(() => callback(null, _.omit(group, 'updatedAt')))
							.catch(err => callback(err, null));
					}
				],
				(err, payload) => {
					if (err) {
						reject(err);
					}
					resolve(payload);
				}
			);
		});
	}

	saveGroupUser(obj) {
		return this.GroupRepository.saveGroupUser(obj);
	}

	saveGroupProject(obj) {
		return this.GroupRepository.saveGroupProject(obj);
	}

	findOneGroupUser(query) {
		return this.GroupRepository.findOneGroupUser(query);
	}

	findOneGroupProject(query) {
		return this.GroupRepository.findOneGroupProject(query);
	}

	findAllByQuery(query) {
		return this.GroupRepository.findAllGroupUser(query);
	}

	findAllFullUserGroups(query) {
		return this.GroupRepository.findAllFullUserGroups(query);
	}
}

module.exports = new GroupService();
