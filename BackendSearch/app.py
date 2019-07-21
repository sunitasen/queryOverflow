import flask
from bs4 import BeautifulSoup
from markdown import markdown
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)

stopwords = ["a","about","above","after","again","against","ain","all","am","an","and","any","are","aren","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can","couldn","couldn't","d","did","didn","didn't","do","does","doesn","doesn't","doing","don","don't","down","during","each","few","for","from","further","had","hadn","hadn't","has","hasn","hasn't","have","haven","haven't","having","he","her","here","hers","herself","him","himself","his","how","i","if","in","into","is","isn","isn't","it","it's","its","itself","just","ll","m","ma","me","mightn","mightn't","more","most","mustn","mustn't","my","myself","needn","needn't","no","nor","not","now","o","of","off","on","once","only","or","other","our","ours","ourselves","out","over","own","re","s","same","shan","shan't","she","she's","should","should've","shouldn","shouldn't","so","some","such","t","than","that","that'll","the","their","theirs","them","themselves","then","there","these","they","this","those","through","to","too","under","until","up","ve","very","was","wasn","wasn't","we","were","weren","weren't","what","when","where","which","while","who","whom","why","will","with","won","won't","wouldn","wouldn't","y","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","could","he'd","he'll","he's","here's","how's","i'd","i'll","i'm","i've","let's","ought","she'd","she'll","that's","there's","they'd","they'll","they're","they've","we'd","we'll","we're","we've","what's","when's","where's","who's","why's","would","able","abst","accordance","according","accordingly","across","act","actually","added","adj","affected","affecting","affects","afterwards","ah","almost","alone","along","already","also","although","always","among","amongst","announce","another","anybody","anyhow","anymore","anyone","anything","anyway","anyways","anywhere","apparently","approximately","arent","arise","around","aside","ask","asking","auth","available","away","awfully","b","back","basically","became","become","becomes","becoming","beforehand","begin","beginning","beginnings","begins","behind","believe","beside","besides","beyond","biol","brief","briefly","c","ca","came","cannot","can't","cause","causes","certain","certainly","co","com","come","comes","contain","containing","contains","couldnt","date","different","done","downwards","due","e","ed","edu","effect","eg","eight","eighty","either","else","elsewhere","end","ending","enough","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","except","f","far","ff","fifth","first","five","fix","followed","following","follows","former","formerly","forth","found","four","furthermore","g","gave","get","gets","getting","give","given","gives","giving","go","goes","gone","got","gotten","h","happens","hardly","hed","hence","hereafter","hereby","herein","heres","hereupon","hes","hi","hid","hither","home","howbeit","however","hundred","id","ie","im","immediate","immediately","importance","important","inc","indeed","index","information","instead","invention","inward","itd","it'll","j","k","keep","keeps","kept","kg","km","know","known","knows","l","largely","last","lately","later","latter","latterly","least","less","lest","let","lets","like","liked","likely","line","little","'ll","look","looking","looks","ltd","made","mainly","make","makes","many","may","maybe","mean","means","meantime","meanwhile","merely","mg","might","million","miss","ml","moreover","mostly","mr","mrs","much","mug","must","n","na","name","namely","nay","nd","near","nearly","necessarily","necessary","need","needs","neither","never","nevertheless","new","next","nine","ninety","nobody","non","none","nonetheless","noone","normally","nos","noted","nothing","nowhere","obtain","obtained","obviously","often","oh","ok","okay","old","omitted","one","ones","onto","ord","others","otherwise","outside","overall","owing","p","page","pages","part","particular","particularly","past","per","perhaps","placed","please","plus","poorly","possible","possibly","potentially","pp","predominantly","present","previously","primarily","probably","promptly","proud","provides","put","q","que","quickly","quite","qv","r","ran","rather","rd","readily","really","recent","recently","ref","refs","regarding","regardless","regards","related","relatively","research","respectively","resulted","resulting","results","right","run","said","saw","say","saying","says","sec","section","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sent","seven","several","shall","shed","shes","show","showed","shown","showns","shows","significant","significantly","similar","similarly","since","six","slightly","somebody","somehow","someone","somethan","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specifically","specified","specify","specifying","still","stop","strongly","sub","substantially","successfully","sufficiently","suggest","sup","sure","take","taken","taking","tell","tends","th","thank","thanks","thanx","thats","that've","thence","thereafter","thereby","thered","therefore","therein","there'll","thereof","therere","theres","thereto","thereupon","there've","theyd","theyre","think","thou","though","thoughh","thousand","throug","throughout","thru","thus","til","tip","together","took","toward","towards","tried","tries","truly","try","trying","ts","twice","two","u","un","unfortunately","unless","unlike","unlikely","unto","upon","ups","us","use","used","useful","usefully","usefulness","uses","using","usually","v","value","various","'ve","via","viz","vol","vols","vs","w","want","wants","wasnt","way","wed","welcome","went","werent","whatever","what'll","whats","whence","whenever","whereafter","whereas","whereby","wherein","wheres","whereupon","wherever","whether","whim","whither","whod","whoever","whole","who'll","whomever","whos","whose","widely","willing","wish","within","without","wont","words","world","wouldnt","www","x","yes","yet","youd","youre","z","zero","a's","ain't","allow","allows","apart","appear","appreciate","appropriate","associated","best","better","c'mon","c's","cant","changes","clearly","concerning","consequently","consider","considering","corresponding","course","currently","definitely","described","despite","entirely","exactly","example","going","greetings","hello","help","hopefully","ignored","inasmuch","indicate","indicated","indicates","inner","insofar","it'd","keep","keeps","novel","presumably","reasonably","second","secondly","sensible","serious","seriously","sure","t's","third","thorough","thoroughly","three","well","wonder"]

@app.route('/search',methods=['GET', 'POST'])
def searchquery():
    content = request.json
    data = content["query"]
    badChar = [";","-","/",":","<",">","?"]
    for dat in badChar:
        data.replace(dat,"")
    querybeg = "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q="
    queryend = "&filter=withbody&site=stackoverflow"
    r = requests.get(querybeg + data + queryend)
    val = r.json()
    relate =[]
    answ = []
    questions = []
    items = val["items"]
    qtags = []
    j = 0
    print(data, len(items))
    for item in items:
        if(j<3):
            time.sleep(0.2)
            qId = item["question_id"]
            qLink = item["link"]
            uname = item["owner"]["display_name"]
            profimage = item["owner"]["profile_image"]
            qtitle = item["title"]
            if(len(qtags)<1):
                qtags = item["tags"]
            qtitle = ''.join(BeautifulSoup(qtitle, features="html5lib").findAll(text=True))
            qtitle = qtitle.replace("&#39;","'")
            qtitle = qtitle.replace("&lt;","<")
            qtitle = qtitle.replace("&gt;",">")
            qhtml = item["body"]
            qbody = ''.join(BeautifulSoup(qhtml, features="html5lib").findAll(text=True))
            qbody = qbody.replace("&quot;","'")
            qbody = qbody.replace("&lt;","<")
            qbody = qbody.replace("&gt;",">")
            qscore = item["score"]
            answered = item["is_answered"]
            print(type(answered))
            if(len(relate) <10):
                relQuesBeg = "http://api.stackexchange.com/questions/"
                relQuesEnd = "/linked?order=desc&sort=activity&site=stackoverflow"
                relQues  = relQuesBeg + str(qId) + relQuesEnd
                related = requests.get(relQues)
                related = related.json()
                relatedItems = related["items"]
                relatedItems = relatedItems[0:4]
                for ri in relatedItems:
                    link = ri["link"]
                    title = ri["title"]
                    obj = {"link": link , "title": title}
                    if obj not in relate:
                        relate.append(obj)

        
            if(answered):
                answersBeg = "http://api.stackexchange.com/2.2/questions/"
                answersEnd = "/answers?order=desc&sort=activity&site=stackoverflow&filter=withbody"
                answers = answersBeg + str(qId) + answersEnd
                ans = requests.get(answers)
                ans = ans.json()
                ansItems = ans["items"]
                ansIt = []
                i = 0
                for ai in ansItems:
                    if(i<2):
                        score = ai["score"]
                        reputation = ai["owner"]["reputation"]
                        name = ai["owner"]["display_name"]
                        link = qLink + "#answer-" + str(ai["answer_id"])
                        accepted = ai["is_accepted"]
                        html = ai["body"]
                        body = ''.join(BeautifulSoup(html, features="html5lib").findAll(text=True))
                        body = body.replace("&quot;","'")
                        body = body.replace("&lt;","<")
                        body = body.replace("&gt;",">")
                        profile_image =ai["owner"]["profile_image"]
                        obj = {"score":score, "accepted":accepted , "body":body , "reputation":reputation , "image":profile_image , "name":name, "link":link , "question": qtitle}
                        answ.append(obj)
                    i += 1
            

            quesobj = {
                "id": qId,
                "link": qLink,
                "username": uname,
                "image": profimage,
                "title": qtitle,
                "body": qbody,
                "score":qscore
            }

            questions.append(quesobj)
        j+=1

    retobj = {"questions": questions , "related": relate , "answers": answ , "tags":qtags}

    return jsonify(retobj)


if __name__ == '__main__':
    try:
        port = int(sys.argv[1]) # This is for a command-line input
    except:
        port = 12345 # If you don't provide any port the port will be set to 12345



    app.run(port=port)