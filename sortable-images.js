(function(global) {
    var imageFiles = [];
    function readAndPreview(files, previewContainerId) {
        $(files).each(function(index, file) {
            imageFiles.push(file);
            var fileReader = new FileReader();
            fileReader.onload = function(event) {
                let img = document.createElement("img");
                img.setAttribute("src", event.target.result);
                img.setAttribute("alt", file.name);
                img.classList.add("previewImage");
                var removeBtn = $('<div class="remove-image">&times;</div>').click(function() {
                    var parent = $(this).parent();
                    var indexToRemove = parent.index();
                    imageFiles.splice(indexToRemove, 1);
                    parent.remove();
                    $('#' + previewContainerId + ' .previewBox').each(function(index, elem) {
                        $(elem).data('index', index);
                    });
                    if($('#' + previewContainerId + ' .previewBox').length == 0){
                        $('#' + previewContainerId).find('button').hide();
                    }
                });
                let imageBox = document.createElement("div");
                imageBox.classList.add("imageBox");
                let imageTitleBox = document.createElement("span");
                let file_name = file.name.substring(0, 15);
                imageTitleBox.append(file_name);
                imageBox.append(img);
                imageBox.append(imageTitleBox);
                var imgContainer = $('<div class="previewBox">').data('index', index).append(imageBox).append(removeBtn);
                $('#' + previewContainerId).append(imgContainer);
                $('#' + previewContainerId).find('button').show();
            };
            fileReader.readAsDataURL(file);
        });
    }
    function enableImagePreview(imageInputId, previewContainerId, files=null) {
        if(imageInputId == "files"){
            readAndPreview(files, previewContainerId);
        }else{
            $('#' + imageInputId).on('change', function() {
                readAndPreview(this.files, previewContainerId);
            });
        }
        setTimeout(() => {
            $('#' + previewContainerId).sortable({
                placeholder: "ui-sortable-placeholder",
                tolerance: "pointer",
                update: function(event, ui) {
                    var newOrder = [];
                    $('#' + previewContainerId + ' .previewBox').each(function() {
                        var index = $(this).data('index');
                        newOrder.push(imageFiles[index]);
                    });
                    imageFiles = newOrder;
                },
                start: function(e, ui) {
                    ui.placeholder.height(ui.item.height());
                }
            }).disableSelection();
        }, 100);
    }
    function getSortedFiles() {
        return imageFiles;
    }
    global.ImagePreviewLibrary = {
        enableImagePreview: enableImagePreview,
        getSortedFiles: getSortedFiles
    };
}(window));
