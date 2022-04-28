$(document).ready(function() {

    /*----------drag and drop---------*/
    $(function() {
        $(".sortable tbody").sortable({
            cursor: "move",
            placeholder: "sortable-placeholder",
            helper: function(e, tr) {
                var $originals = tr.children();
                var $helper = tr.clone();
                $helper.children().each(function(index) {
                    // Set helper cell sizes to match the original sizes
                    $(this).width($originals.eq(index).width());
                });
                return $helper;
            }
        }).disableSelection();
    });

    /*--add class-*/

    $(".create-issue-sec .add-input-click").click(function() {
        $(this).next().removeClass('d-none');
    });

    $(document).on('click', ".add-comment-input", function() {
        $(".add-textarea").removeClass('d-none');
        $(".add-comment-input").addClass('d-none');
    });

    $(document).on('click', ".cancel-btn", function() {
        $(".add-comment-input").removeClass('d-none');
        $(".add-textarea").addClass('d-none');
    });


    $(document).on('click', "#forget-password", function() {
        event.preventDefault();
        $("#sign-in").removeClass('d-block');
        $("#sign-in").addClass('d-none');
        $("#forget").removeClass('d-none');
        $("#forget").addClass('d-block');
        $("#sign-up").removeClass('d-block');
        $("#sign-up").addClass('d-none');


    });

    $(document).on('click', ".cancel-forget", function() {
        event.preventDefault();
        $("#forget").removeClass('d-block');
        $("#forget").addClass('d-none');
        $("#sign-in").removeClass('d-none');
        $("#sign-in").addClass('d-block');
        $("#sign-up").removeClass('d-block');
        $("#sign-up").addClass('d-none');

    });

    $(document).on('click', "#signup", function() {
        event.preventDefault();
        $("#forget").removeClass('d-block');
        $("#forget").addClass('d-none');
        $("#sign-in").removeClass('d-block');
        $("#sign-in").addClass('d-none');
        $("#sign-up").removeClass('d-none');
        $("#sign-up").addClass('d-block');
    });


    // TinyMCE editor
    $('textarea#tiny').tinymce({
        height: 500,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
    });

    // quill editor
    var quill = new Quill('#editor', {
        theme: 'snow'
    });

    // summernote editor
    $('#summernote').summernote({
        placeholder: 'This is summernote text editor',
        tabsize: 2,
        height: 120,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });



});


$("#kt_daterangepicker_3 , #kt_daterangepicker_4 ,#kt_daterangepicker_1 , #kt_daterangepicker_2").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 10)
}, function(start, end, label) {
    var years = moment().diff(start, "years");
    alert("You are " + years + " years old!");
});


// Initialization
jQuery(document).ready(function() {
    KTSelect2.init();
});





/*---------------Gantt Roadmap------------*/
function createChart(e) {
    const days = document.querySelectorAll(".chart-values li");
    const tasks = document.querySelectorAll(".chart-bars li");
    const daysArray = [...days];

    tasks.forEach(el => {
        const duration = el.dataset.duration.split("-");
        const startDay = duration[0];
        const endDay = duration[1];
        let left = 0,
            width = 0;

        if (startDay.endsWith("½")) {
            const filteredArray = daysArray.filter(day => day.textContent == startDay.slice(0, -1));
            left = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2;
        } else {
            const filteredArray = daysArray.filter(day => day.textContent == startDay);
            left = filteredArray[0].offsetLeft;
        }

        if (endDay.endsWith("½")) {
            const filteredArray = daysArray.filter(day => day.textContent == endDay.slice(0, -1));
            width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2 - left;
        } else {
            const filteredArray = daysArray.filter(day => day.textContent == endDay);
            width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth - left;
        }

        // apply css
        el.style.left = `${left}px`;
        el.style.width = `${width}px`;
        if (e.type == "load") {
            el.style.backgroundColor = el.dataset.color;
            el.style.opacity = 1;
        }
    });
}

window.addEventListener("load", createChart);
window.addEventListener("resize", createChart);





$(document).ready(function(){

       $("#kt_accordion_1_header_1").click(function(){
        $("#task-issue-2").removeClass('show');
        $("#roadmap-acc-1").addClass('d-none');
        if ( $("#roadmap-acc-2").hasClass('d-none')) {
              $("#roadmap-acc-2").removeClass('d-none');
        }else{
             $("#roadmap-acc-2").addClass('d-none');
        }
      
      });


       $("#kt_accordion_2_header_2").click(function(){
        $("#task-issue-1").removeClass('show');
            $("#roadmap-acc-2").addClass('d-none');
        if ( $("#roadmap-acc-1").hasClass('d-none')) {
              $("#roadmap-acc-1").removeClass('d-none');
        }else{
             $("#roadmap-acc-1").addClass('d-none');
        }
  
      });

       
});



