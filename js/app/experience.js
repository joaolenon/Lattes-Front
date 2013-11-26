$(document).ready(function() {
    parseQueryString();
    getData(drawExperienceTable);

    getAllGroups(function(groups) {
        var select = $('#input-group');

        for (key in groups) {
            var group = groups[key];
            select.append('<option value="'+group.name+'">'+group.name+'</option>');
        }
    });
});

function getData(endCallback) {
    getGroupMembers(function(group) {
        var data = [];
        for(var i = 0; i < group.length; i++) {
            var lattes       = group[i],
                user         = getUserData(lattes),
                professional = getProfessionalData(user.id);

            data.push({
                name: user.name,
                experience: user.experience,
                professional: professional
            });
        }

        endCallback(data);
    });
}

function getProfessionalData(user) {
    var jsonData = $.ajax({
            url: 'http://ws-lattes.gopagoda.com/users/'+user+'/professional',
            dataType:"json",
            async: false
        }).responseText;

    return JSON.parse(jsonData);
}

function drawExperienceTable(data) {
    var table = $('#teachers-professional-experience .accordion');
    for(var i = 0; i < data.length; i++) {
        var professional = '';

        for(var j = 0; j < data[i].professional.length; j++) {
            professional += '<p>' + data[i].professional[j].workplace + 
                            ' ' + data[i].professional[j].link  + 
                            ' Início: ' + data[i].professional[j].start +  
                            ' Fim: ' + data[i].professional[j].end + '</p>';
        }

        var row = 
            '<div class="accordion-group">'+
                '<div class="accordion-heading">'+
                    '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '">'+ 
                        data[i].name + ' - Aprox: ' + 
                        data[i].experience + ' anos ' + 
                    '</a>'+
                '</div>'+
                '<div id="collapse' + i + '" class="accordion-body collapse">'+
                    '<div class="accordion-inner">'+
                        professional
                    '</div>'+
                '</div>'+
            '</div>';

        table.append(row);
    }
}
