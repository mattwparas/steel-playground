(this.webpackJsonp=this.webpackJsonp||[]).push([[79],{66:function(t,e,n){"use strict";n.r(e),e.default=';; Implementation of a stack in `steel`\n;; Returning multiple values requires returning as a list\n;; Functional data structure, is definitely verbose but is super helpful\n;; Maybe look into using monadic forms in order to not have the verbosity\n;; associated with a functional data structure\n\n;; ---------------------------------------------------------------------\n;; Make the same stack but instead wrap the list with a struct data type\n;;\n;; A little bit more boilerplate, but adds some runtime checks for us\n;; ---------------------------------------------------------------------\n\n;; destruct works like so:\n;; (destruct (a b c) value)\n;;  ...\n;; (define a (car value)\n;; (define b (car (cdr value)))\n;; (define c (car (cdr (cdr value))))\n(define-syntax destruct\n  (syntax-rules ()\n    [(destruct (var) ret-value)\n     (define (datum->syntax var) (car ret-value))]\n    [(destruct (var1 var2 ...) ret-value)\n     (begin (define (datum->syntax var1) (car ret-value))\n            (destruct (var2 ...) (cdr ret-value)))]))\n\n;; destruct a list\n(define-syntax let-destruct\n  (syntax-rules ()\n    [(let-destruct ((var) ret-value) body ...)\n     (let ((var (if (null? (cdr ret-value))\n                    (car ret-value)\n                    ret-value)))\n       (begin body ...))]\n    [(let-destruct ((var1 var2 ...) ret-value) body ...)\n     (let ((var1 (car ret-value)))\n       (let-destruct ((var2 ...) (cdr ret-value))\n                     body ...))]))\n\n(define-syntax def-method\n  (syntax-rules ()\n    [(def-method struct-name (define/method (a this b ...) body ...))\n     (define ((datum->syntax struct-name . a) this b ...)\n       (unless ((datum->syntax struct-name ?) this)\n         (error! (datum->syntax struct-name . a) "method takes a value of" struct-name "given" this))\n       body ...)]))\n\n;; impl block asserts that each function contains the struct type given as the first argument\n;; This is why later down we use the thread first vs. the thread last given above\n;;\n;; However, take note that a recursive call will not work properly in this, best to be used as an interface\n;; since it does not transform the name of the recursive call\n(define-syntax impl\n  (syntax-rules ()\n    [(impl struct-name (define/method (a this b ...) body ...) c ...)\n     (begin (def-method struct-name (define/method (a this b ...) body ...))\n            (impl struct-name c ...))]\n    [(impl struct-name (define/method (a this b ...) body ...))\n     (def-method struct-name (define/method (a this b ...) body ...))]))\n\n\n(struct Stack (lst))\n(impl Stack\n      (define/method (pop stack)\n        (define contents (Stack-lst stack))\n        (if (null? contents)\n            \'(#f \'())\n            (list (car contents) (cdr contents))))\n\n      (define/method (push stack value)\n        (define contents (Stack-lst stack))\n        (Stack (cons value contents))))\n\n(define test-stack (Stack \'()))\n\n(destruct (pop-val-test new-stack-test)\n          (-> test-stack\n               (Stack.push 1)\n               (Stack.push 2)\n               (Stack.push 3)\n               (Stack.push 4)\n               (Stack.pop)))\n\npop-val-test ;; => 4\nnew-stack-test ;; => \'(3 2 1)\n\n\n(let-destruct ((pop-val new-stack)\n               (-> test-stack\n                   (Stack.push 1)\n                   (Stack.push 2)\n                   (Stack.push 3)\n                   (Stack.push 4)\n                   (Stack.pop)))\n\n              (displayln "Hello world")\n              (displayln pop-val)\n              (displayln new-stack))\n\n(let-destruct\n ((a b c)\n  (list 1 2 3 4 5 6 7 8 9 10))\n (displayln a)\n (displayln b)\n (displayln c))\n'}}]);