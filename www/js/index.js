var app = {
    reviewData: [],
    KEY: 'liu00414ReviewR',
    rating: 0,
    photoTaken: false,
    imgURI: '. / img / logo.png',
    init: function () {

        console.log(navigator.camera);
        if (localStorage.getItem(app.KEY)) {
            app.reviewData = JSON.parse(localStorage.getItem(app.KEY));
            console.log(document.querySelector('.list-view'));
            document.querySelector('.list-view').innerHTML = '';
            app.reviewData.forEach(obj => app.showOnList(obj));

        } else {
            localStorage.setItem(app.KEY, JSON.stringify(app.reviewData));
        }
        if (app.reviewData.length == 0) {
            document.getElementById('open-msg').classList.add('empty-list');
        } else {
            document.getElementById('open-msg').classList.remove('empty-list');
        }


        document.getElementById('take-btn').addEventListener('click', app.take);
        //add listeners to nav bars
        let navButton = document.querySelectorAll('nav>button');
        console.log(navButton);
        navButton.forEach((btn) => {
            btn.addEventListener('click', app.nav)
        });


        //setup star rating      
        app.initRating();
    },
    take: function () {


        //use camera plugin to take picture
        navigator.camera.getPicture(app.ftw, app.wtf, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true, //Corrects Android orientation quirks
            targetHeight: 300,
            targetWidth: 300


        });
    },
    ftw: function (imgURI) {
        //success
        app.photoTaken = true;

        let img = document.getElementById('photo');
        app.imgURI = imgURI;
        img.src = imgURI;
        img.className='active';
        document.getElementById('msg').textContent = '';
        let takeBtn = document.getElementById('take-btn');
        takeBtn.classList.add('hidden');
        document.getElementById('instruction').classList.add('hidden');

    },
    wtf: function (message) {
        //fail
        let msgBox = document.getElementById('msg');
        msgBox.textContent = 'Fail to take a photo!' + message;
        let msg = document.querySelector('.pop-msg');
        msg.classList.add('show');
        setTimeout(function () {
            msg.classList.remove('show')
        }, 1500);
    },
    nav: function (ev) {
        ev.preventDefault();
        let btn = ev.target.getAttribute('id');
        console.log(document.getElementById('add-new'));
        switch (btn) {
            case 'add':
                document.getElementById('add-new').classList.add('active');
                document.getElementById('home').classList.remove('active');
                break;
            case 'cancel':
                app.clearForm();
                document.getElementById('add-new').classList.remove('active');
                document.getElementById('home').classList.add('active');
                break;
            case 'back':
                console.log('iiiiii');
                document.getElementById('photo-detail').classList.remove('active');
                document.getElementById('home').classList.add('active');
            case 'delete':
                app.delPhoto(ev);
                break;


                //save
            default:
                let title = document.getElementById('title').value;

                if (title && app.rating != 0 && app.photoTaken) {
                    console.log('iiiiii');
                    document.getElementById('msg').textContent = 'Your review successfully saved!';
                    app.savPhoto();

                    setTimeout(function(){
                        document.getElementById('add-new').classList.remove('active');
                    document.getElementById('home').classList.add('active');
                    app.clearForm();
                    },2500);
                    
                    
                    
                } else {
                    document.getElementById('msg').textContent = 'Please take a photo, give it a title and rating.';

                }
                let msg = document.querySelector('#add-new .pop-msg');
                msg.classList.add('show');
                setTimeout(function () {
                    msg.classList.remove('show')
                }, 1500);

                break;

        };
        if (app.reviewData.length == 0) {
            document.getElementById('open-msg').classList.add('empty-list');
        } else if (document.querySelector('.empty-list')) {
            document.getElementById('open-msg').classList.remove('empty-list');
        }

    },
    makeStars: function (rating) {
        let stars = document.createElement('p');
        stars.className = 'rating stars';
        for (i = 0; i < rating; i++) {
            let star = document.createElement('span');
            star.className = 'star rated';
            star.textContent = ' ';
            stars.appendChild(star);
        };
        if (rating < 5) {
            for (i = 0; i < (5 - rating); i++) {
                let star = document.createElement('span');
                star.className = 'star';
                star.textContent = ' ';
                stars.appendChild(star);
            }
        }
        return stars;
    },
    initRating: function () {
        //add eventlistener to star ratings
        let stars = document.querySelectorAll('#add-new .star');
        console.log(stars);
        let rating = 0;
            [].forEach.call(stars, function (star, index) {

            star.addEventListener('click', (function (idx) {
                console.log('adding listener', index);
                return function () {
                    rating = idx + 1;
                    console.log('Rating is now', rating)
                    app.setRating(rating);
                }
            })(index));

        });
        app.setRating(rating); //initial rating, default 
    },
    setRating: function (rating) {

        let stars = document.querySelectorAll('#add-new .star');
        app.rating = rating;



  [].forEach.call(stars, function (star, index) {
            if (rating > index) {
                star.classList.add('rated');
                console.log('added rated on', index);
            } else {
                star.classList.remove('rated');
                console.log('removed rated on', index);
            }
        });
        //app.savPhoto();


    },



    savPhoto: function (ev) {
        //ev.preventDefault();
        let id = Date.now();
        let name = document.getElementById('title').value;
        let obj = {
            'id': id,
            'name': name,
            'rating': app.rating,
            'img': app.imgURI
        };
        console.log(obj);
        app.reviewData.push(obj);
        localStorage.setItem(app.KEY, JSON.stringify(app.reviewData));
        console.log(app.reviewData);

        app.showOnList(obj);
        app.photoTaken = false;
    },
    showOnList: function (obj) {
        let list = document.querySelector('#home .list-view');
        let fg = document.createDocumentFragment();
        let li = document.createElement('li');
        li.className = 'list-item';
        let thumbnail = document.createElement('img');
        thumbnail.src = obj.img;
        thumbnail.className = 'thumbnail avatar-box';
        thumbnail.alt = 'review photo';
        let span = document.createElement('span');
        span.className = 'action-right icon arrow_right';
        let title = document.createElement('p');
        title.textContent = obj.name;

        //make stars
        let stars = app.makeStars(obj.rating);

        //save data as attribute to list item
        li.setAttribute('itemId', obj.id);
        //add eventlistener when user tap on the list item, go to detail page
        li.addEventListener('click', app.showDetail);
        //appendChild

        li.appendChild(thumbnail);
        li.appendChild(span);
        li.appendChild(title);
        li.appendChild(stars);

        fg.appendChild(li)
        list.appendChild(fg);

    },

    showDetail: function (ev) {
        let container = document.getElementById('detail-container');
        container.innerHTML = '';
        //make content
        let id = ev.target.getAttribute('itemId');
        let targetObj = app.reviewData.filter(obj => obj.id == id);
        document.getElementById('delete').setAttribute('detail-id', targetObj[0].id);
        console.log(targetObj);

        //make detail page elements
        let fg = document.createDocumentFragment();
        let img = document.createElement('img');
        let h2 = document.createElement('h2');
        img.src = targetObj[0].img;

        img.alt = 'detail photo';
        h2.textContent = targetObj[0].name;
        //make stars
        let stars = app.makeStars(targetObj[0].rating);

        fg.appendChild(img);
        fg.appendChild(h2);
        fg.appendChild(stars);
        container.appendChild(fg);

        //show detail page and hide home page
        document.getElementById('home').classList.remove('active');
        document.getElementById('photo-detail').classList.add('active');
    },
    delPhoto: function (ev) {
        //remove from data storage
        let idToDelete = ev.target.getAttribute('detail-id');
        app.reviewData = app.reviewData.filter(obj => obj.id != idToDelete);
        localStorage.setItem(app.KEY, JSON.stringify(app.reviewData));
        //remove from page
        //let selector = 'li[itemid=' +idToDelete+']';
        let targetItem = document.querySelector("li[itemid='" + idToDelete + "']");
        console.log(idToDelete);

        targetItem.parentNode.removeChild(targetItem);
        let msg = document.querySelector('#photo-detail .pop-msg');

        msg.classList.add('show');

        setTimeout(function () {
            msg.classList.remove('show')
            document.getElementById('photo-detail').classList.remove('active');
            document.getElementById('home').classList.add('active');
        }, 2000);
        if (app.reviewData.length == 0) {
            document.getElementById('open-msg').classList.add('empty-list');
        }
    },
    clearForm: function () {
        document.getElementById('take-btn').classList.remove('hidden');
        document.getElementById('instruction').classList.remove('hidden');
        document.querySelector('form').reset();
        let ratedStar = document.querySelectorAll('#add-new .star.rated');
        if (ratedStar) {
            ratedStar.forEach(rated => rated.classList.remove('rated'));
        }
        let photo=document.getElementById('photo');
        photo.src = '';
        photo.classList.remove('active');
    }
}

let ready = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(ready, app.init);
