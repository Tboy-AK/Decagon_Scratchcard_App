$(document).ready(()=>{
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    //sign-up user
        //check for input errors after a blur/keyup on the given input
        //for errors, add custom error-defined attributes to the given input, else remove
        //use css display property to manipulate the input error correction fields
        //post input details to users db resource if no input errors
        //hide sign-up section and display sign-in section

    //sign-in user
        //check for input errors after a blur/keyup on the given input
        //verify user input
        //empty signed-in db resource
        //post input details to `signed-in` db resource if no input errors
        var signin_username;

    //generate scratchcard
        //post generated scratchcard to `generated_scratchcards` db resource
        //this resource will have a main property named after the signed-in username
        //the other properties fall under this usernamed property
        //add the generated scratchcard to the `generated` column of the scratchcard table
        

    //buy scratchcard
        //a scratchcard is not bought until paid for
        //delete scratchcards from generated_scratchcards and update the `generated` column after buying
        //post bought scratchcards in `bought_scratchcards` db rsource
        //this resource will have a main property named after the signed-in username
        //the other properties fall under this usernamed property
        //add the bought scratchcard to the `bought` column of the scratchcard table
});