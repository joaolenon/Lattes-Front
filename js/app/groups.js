function renderGroupTable(groups) {
	var table = $('#group-list tbody');

	for (key in groups) {
		var group = groups[key];
		table.append('<tr><td class="group-name">'+group.name+'</td><td><button type="button" class="btn remove-group">-</button></td></tr>');
	}
}

$(document).ready(function() {
	getAllGroups(renderGroupTable);

	$('#group-form').submit(function(event) {
		event.preventDefault();

		var name = $('#group-name').val(),
			usersLattes = $('#user-list tr .user-lattes'),
			users = [];

		$.each(usersLattes, function(key, el) {
			var value = $(el).text();
			users.push(value);
		});

		insertGroup(name, users);

		$('#group-list tbody').append('<tr><td class="group-name">'+name+'</td><td><button type="button" class="btn remove-group">-</button></td></tr>');
		$('#group-name').val('');
		$('#user-list tbody tr').remove();
	})

	$(document).on('click', '.remove-group', function() {
		var	row = $(this).parents('tr'),
		 	name = row.find('[class="group-name"]').text();

		removeGroup(name);
		row.remove();
	});

	$('#add-user').click(function() {
		var user = $('#user-lattes').val()
			row = $('<tr></tr>'),
			removeButton = '<button type="button" class="btn remove-user">-</button>';

		$(row).append('<td class="user-lattes">'+user+'</td>');
		$(row).append('<td>'+removeButton+'</td>');

		$('#user-list tbody').append(row);
		$('#user-lattes').val('');
	});

	$(document).on('click', '.remove-user', function() {
		$(this).parents('tr').remove();
	});
});